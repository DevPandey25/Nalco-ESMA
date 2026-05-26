const Request = require('../models/requestModel');
const { getNextState } = require('./workflowTransitions');
const { ROLE_PERMISSIONS, STATE_STAGE_MAP, ASSIGNED_TO_MAP, WORKFLOW_STATES } = require('./workflowRules');
const auditService = require('./auditService');
const notificationService = require('./notificationService');
const aiProvider = require('../ai/services/aiProvider');

class WorkflowService {
    /**
     * Execute a workflow state transition
     * @param {Object} params
     * @param {string} params.requestId
     * @param {string} params.action - Action being taken (SUBMIT, RECOMMEND, APPROVE, IMPLEMENT, REJECT, RETURN)
     * @param {Object} params.user - Action executor { id, name, role, personalNo }
     * @param {string} params.comment - Mandatory justification comment
     * @param {Object} [params.signatureRecord] - Reference signature record if applicable
     */
    async executeTransition({ requestId, action, user, comment, signatureRecord }) {
        const query = requestId.startsWith('ESMA-') ? { requestId } : { _id: requestId };
        const request = await Request.findOne(query);

        if (!request) {
            throw new Error(`Target request identifier (${requestId}) could not be resolved.`);
        }

        const currentState = request.status;

        // 1. Enforce Role Permissions
        const allowedActions = ROLE_PERMISSIONS[user.role] || [];
        if (!allowedActions.includes(action) && user.role !== 'IT Admin') {
            throw new Error(`Role access violation: User role (${user.role}) is unauthorized to trigger action (${action}).`);
        }

        // 2. Validate legal transition target state
        const targetState = getNextState(currentState, action);
        if (!targetState && user.role !== 'IT Admin') {
            throw new Error(`Workflow graph inconsistency: Illegal transition path from state (${currentState}) using action (${action}).`);
        }

        const nextStatus = targetState || action; // If IT admin overrides arbitrary state target

        // Calculate metadata updates
        const nextStage = STATE_STAGE_MAP[nextStatus] || request.currentStage;
        const nextAssignedTo = ASSIGNED_TO_MAP[nextStatus] || 'None';

        // 3. Trigger asynchronous AI processing if transitioning directly to review queues
        let updatedSummary = request.aiSummary;
        let riskScore = request.aiRiskScore;
        let riskLevel = request.aiRiskLevel;

        if (action === 'SUBMIT') {
            // Calculate request duration for risk weighting
            const durationMs = new Date(request.toDate) - new Date(request.fromDate);
            const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

            const riskAnalysis = await aiProvider.analyzeRisk({
                mediaType: request.mediaType,
                department: request.department,
                durationDays,
                previousRejectionsCount: 0 // Mock counter placeholder
            });

            riskScore = riskAnalysis.aiRiskScore;
            riskLevel = riskAnalysis.aiRiskLevel;

            // Generate contextual dynamic summary
            updatedSummary = await aiProvider.summarize({
                justification: request.justification,
                mediaType: request.mediaType,
                department: request.department,
                role: user.role
            });
        }

        // Apply mutation
        request.status = nextStatus;
        request.currentStage = nextStage;
        request.assignedTo = nextAssignedTo;
        request.aiSummary = updatedSummary;
        request.aiRiskScore = riskScore;
        request.aiRiskLevel = riskLevel;

        let signKey = null;
        let commentKey = null;
        if (action === 'SUBMIT') { 
            signKey = 'employeeSign'; 
            commentKey = 'employee';
        } else if (action === 'RECOMMEND' || (action === 'REJECT' && user.role === 'HOD')) { 
            signKey = 'hodSign'; 
            commentKey = 'hod'; 
        } else if (action === 'APPROVE' || (action === 'REJECT' && user.role === 'Competent Authority')) { 
            signKey = 'caSign'; 
            commentKey = 'ca'; 
        } else if (action === 'IMPLEMENT') { 
            signKey = 'naSign'; 
            commentKey = 'na'; 
        }

        if (signKey) {
            // ensure object exists
            const currentSigs = request.signatures || {};
            currentSigs[signKey] = {
                name: user.name || user.personalNo,
                timestamp: new Date().toLocaleString(),
                comment: comment,
                signatureId: signatureRecord ? signatureRecord._id : null
            };
            request.signatures = currentSigs;
            request.markModified('signatures');
        }

        if (commentKey && comment) {
            const currentComments = request.comments || {};
            currentComments[commentKey] = comment;
            request.comments = currentComments;
            request.markModified('comments');
        }

        await request.save();

        // 4. Generate immutable audit logs
        await auditService.logAction({
            requestId: request.requestId,
            actionType: 'STATE_TRANSITION',
            performedBy: user.name || user.personalNo,
            role: user.role,
            details: `Workflow mutation executed via action [${action}]. Justification comment: "${comment}"`,
            previousState: currentState,
            newState: nextStatus,
            ipAddress: '127.0.0.1', // populated via request header wrappers
            userAgent: 'Enterprise-Client'
        });

        // 5. Trigger event alerts and email queues
        // Determine notification routing logic based on target states
        let alertTitle = `Workflow progress update on request ${request.requestId}`;
        let alertMsg = `Request transitioned to stage [${nextStatus}] by ${user.role}. Comment: ${comment}`;
        let alertRole = nextAssignedTo === 'HOD' ? 'HOD' : nextAssignedTo === 'CA' ? 'Competent Authority' : 'Employee';

        if (nextStatus === WORKFLOW_STATES.REJECTED) {
            alertTitle = `⚠️ Request Rejected: ${request.requestId}`;
            alertRole = 'Employee';
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
            alertMsg = `Your request ${request.requestId} has been rejected by ${user.name} (${user.role}). Please review the comments and reapply.\n\nRejecter Profile: ${clientUrl}/profile/${user.personalNo || user.id}\n\nRejection Comment: ${comment}`;
        } else if (nextStatus === WORKFLOW_STATES.APPROVED) {
            alertTitle = `✅ Request Approved: Implementation pending for ${request.requestId}`;
            alertRole = 'Network Admin';
        }

        await notificationService.dispatchNotification({
            recipient: request.email || request.employee,
            recipientRole: alertRole,
            title: alertTitle,
            message: alertMsg,
            requestId: request.requestId,
            type: nextStatus === WORKFLOW_STATES.REJECTED ? 'REJECTION_ALERT' : 'WORKFLOW_UPDATE',
            sendViaEmail: true
        });

        return request;
    }
}

module.exports = new WorkflowService();
