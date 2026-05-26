const requestService = require('../services/requestService');
const auditService = require('../services/auditService');

// @desc    Create new ESMA Request
// @route   POST /api/v1/requests
// @access  Private
const createRequest = async (req, res, next) => {
    try {
        const request = await requestService.createRequest(req.body, req.user);
        res.status(201).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all requests (Paginated, Filtered, Role-scoped)
// @route   GET /api/v1/requests
// @access  Private
const getRequests = async (req, res, next) => {
    try {
        // req.user has ID and role injected by authMiddleware
        // Let's populate mock role if auth object isn't fully enriched
        const userScope = { 
            id: req.user.id, 
            role: req.user.role || 'Employee',
            personalNo: req.user.personalNo || '1001',
            name: req.user.name || 'NALCO User'
        };

        const result = await requestService.getRequests(req.query, userScope);
        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single request by ID or RequestId
// @route   GET /api/v1/requests/:id
// @access  Private
const getRequestById = async (req, res, next) => {
    try {
        const userScope = { role: req.user.role || 'Employee', personalNo: req.user.personalNo || '1001' };
        const request = await requestService.getRequestById(req.params.id, userScope);
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

// @desc    Update request details
// @route   PUT /api/v1/requests/:id
// @access  Private
const updateRequest = async (req, res, next) => {
    try {
        const userScope = { role: req.user.role || 'Employee', personalNo: req.user.personalNo || '1001' };
        const updated = await requestService.updateRequest(req.params.id, req.body, userScope);
        res.status(200).json({
            success: true,
            data: updated
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete request
// @route   DELETE /api/v1/requests/:id
// @access  Private
const deleteRequest = async (req, res, next) => {
    try {
        const userScope = { role: req.user.role || 'Employee' };
        await requestService.deleteRequest(req.params.id, userScope);
        res.status(200).json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get audit logs for a request
// @route   GET /api/v1/requests/:id/audit
// @access  Private
const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await auditService.getAuditLogsForRequest(req.params.id);
        res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    getAuditLogs
};
