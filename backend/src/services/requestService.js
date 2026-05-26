const Request = require('../models/requestModel');
const notificationService = require('./notificationService');

class RequestService {
    // Generate a formatted sequential requestId
    async generateRequestId() {
        const count = await Request.countDocuments();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `ESMA-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    }

    async createRequest(data, user) {
        const requestId = await this.generateRequestId();
        
        // Setup initial default workflow metadata
        const requestPayload = {
            ...data,
            requestId,
            employee: data.employee || user.name,
            employeeId: data.employeeId || user.personalNo,
            status: 'SUBMITTED',
            currentStage: 'HOD Recommendation',
            assignedTo: user.role === 'Employee' ? 'HOD' : 'Competent Authority',
            signatures: {
                employeeSign: {
                    name: (data.signatureData && data.signatureData.name) || data.employee || user.name,
                    timestamp: (data.signatureData && data.signatureData.timestamp) || new Date().toLocaleString(),
                    comment: data.comment || data.justification || 'Submitted request'
                }
            },
            comments: {
                employee: data.comment || data.justification || 'Submitted request'
            }
        };

        // Placeholder for initial AI analysis trigger (will be decoupled/queued)
        requestPayload.aiRiskScore = 15; // default low score
        requestPayload.aiRiskLevel = 'LOW';
        requestPayload.aiSummary = 'Standard ESMA access request for operation.';

        const newRequest = await Request.create(requestPayload);

        // Dispatch email notification to the address provided in the form
        try {
            await notificationService.dispatchNotification({
                recipient: newRequest.email || newRequest.employee,
                recipientRole: 'Employee',
                title: `📋 Request Submitted: ${newRequest.requestId}`,
                message: `Your External Storage Media Access Request (${newRequest.requestId}) has been successfully submitted and is currently pending HOD Recommendation.`,
                requestId: newRequest.requestId,
                type: 'WORKFLOW_UPDATE',
                sendViaEmail: true
            });
        } catch (err) {
            console.error('Failed to send submission email:', err.message);
        }

        return newRequest;
    }

    async getRequests(query, user) {
        const { page = 1, limit = 10, status, search, department, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        
        // Build role-based visibility and filters
        const filter = {};

        // Role visibility rules
        if (user.role === 'Employee') {
            filter.employeeId = user.personalNo;
        } else if (user.role === 'HOD') {
            // HOD sees requests assigned to them or within their department
            // Assuming user object has department or see all unapproved for scope
            filter.$or = [{ assignedTo: 'HOD' }, { status: { $ne: 'DRAFT' } }];
        } else if (user.role === 'Competent Authority') {
            filter.status = { $in: ['RECOMMENDED', 'APPROVED', 'IMPLEMENTED'] };
        } else if (user.role === 'Network Admin') {
            filter.status = { $in: ['APPROVED', 'IMPLEMENTED'] };
        }
        // IT Admin sees all scopes by default (filter is left empty)

        // Status Filter
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Department Filter
        if (department) {
            filter.department = department;
        }

        // Search text Filter
        if (search) {
            filter.$or = [
                { requestId: { $regex: search, $options: 'i' } },
                { employee: { $regex: search, $options: 'i' } },
                { justification: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const requests = await Request.find(filter)
            .sort(sortOptions)
            .skip(Number(skip))
            .limit(Number(limit));

        const total = await Request.countDocuments(filter);

        return {
            data: requests,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getRequestById(id, user) {
        const query = id.startsWith('ESMA-') ? { requestId: id } : { _id: id };
        const request = await Request.findOne(query);
        if (!request) {
            throw new Error('Request not found');
        }
        // Verify visibility if needed
        return request;
    }

    async updateRequest(id, updateData, user) {
        const request = await Request.findById(id);
        if (!request) {
            throw new Error('Request not found');
        }

        // Enforce basic permissions: only editable if DRAFT or returned
        if (request.status !== 'DRAFT' && request.status !== 'RETURNED' && user.role === 'Employee') {
            throw new Error('Submitted requests cannot be modified directly by the employee.');
        }

        const updated = await Request.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        return updated;
    }

    async deleteRequest(id, user) {
        const request = await Request.findById(id);
        if (!request) {
            throw new Error('Request not found');
        }

        // Only delete DRAFTs or full override by IT Admin
        if (request.status !== 'DRAFT' && user.role !== 'IT Admin') {
            throw new Error('Only draft requests can be deleted.');
        }

        await Request.findByIdAndDelete(id);
        return true;
    }
}

module.exports = new RequestService();
