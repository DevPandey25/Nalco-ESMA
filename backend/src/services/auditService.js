const AuditLog = require('../models/auditLogModel');

class AuditService {
    /**
     * Log an immutable audit entry
     * @param {Object} params
     * @param {string} params.requestId
     * @param {string} params.actionType
     * @param {string} params.performedBy
     * @param {string} params.role
     * @param {string} params.details
     * @param {string} [params.previousState]
     * @param {string} [params.newState]
     * @param {string} [params.ipAddress]
     * @param {string} [params.userAgent]
     */
    async logAction({
        requestId,
        actionType,
        performedBy,
        role,
        details,
        previousState,
        newState,
        ipAddress,
        userAgent
    }) {
        try {
            const entry = await AuditLog.create({
                requestId,
                actionType,
                performedBy,
                role,
                details,
                previousState,
                newState,
                ipAddress,
                userAgent
            });
            return entry;
        } catch (error) {
            console.error('CRITICAL: Failed to create immutable audit log:', error.message);
            // In a highly critical environment, rethrow or alert operations
            throw error;
        }
    }

    async getAuditLogsForRequest(requestId) {
        return await AuditLog.find({ requestId }).sort({ createdAt: 1 });
    }
}

module.exports = new AuditService();
