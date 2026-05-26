const Approval = require('../models/approvalModel');
const workflowService = require('./workflowService');
const signatureService = require('./signatureService');

class ApprovalService {
    /**
     * Centralized execution logic for approval flow actions
     * @param {Object} params
     * @param {string} params.requestId
     * @param {string} params.action - Action trigger: RECOMMEND, APPROVE, REJECT, IMPLEMENT
     * @param {Object} params.user
     * @param {string} params.comment
     * @param {Object} [params.signatureData] - { signatureImage, signatureType }
     */
    async processApprovalAction({ requestId, action, user, comment, signatureData }) {
        if (!comment) {
            throw new Error('Mandatory workflow justification comment is missing.');
        }

        // 1. Process and store digital signature if provided payload exists
        let signatureRecord = null;
        if (signatureData && signatureData.signatureImage) {
            signatureRecord = await signatureService.storeSignature({
                requestId,
                signedBy: user.name || user.personalNo,
                role: user.role,
                signatureImage: signatureData.signatureImage,
                signatureType: signatureData.signatureType || 'canvas'
            });
        }

        // 2. Delegate state modification to Workflow Engine to enforce validation matrix rules
        const updatedRequest = await workflowService.executeTransition({
            requestId,
            action,
            user,
            comment,
            signatureRecord
        });

        // 3. Persist concrete granular approval action tracking document
        const approvalEntry = await Approval.create({
            requestId: updatedRequest.requestId,
            approver: user.name || user.personalNo,
            role: user.role,
            action,
            comment,
            signatureId: signatureRecord ? signatureRecord._id : undefined
        });

        return {
            approvalEntry,
            requestStatus: updatedRequest.status,
            currentStage: updatedRequest.currentStage
        };
    }

    async getApprovalHistory(requestId) {
        return await Approval.find({ requestId })
            .populate('signatureId')
            .sort({ createdAt: 1 });
    }
}

module.exports = new ApprovalService();
