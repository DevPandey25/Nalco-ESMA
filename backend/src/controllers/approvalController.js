const approvalService = require('../services/approvalService');

const handleApprovalAction = (actionType) => async (req, res, next) => {
    try {
        const { requestId, comment, signatureData } = req.body;
        
        // Populate scope user details safely from JWT decoded injection
        const userScope = {
            id: req.user.id,
            role: req.user.role || 'HOD',
            personalNo: req.user.personalNo || '2001',
            name: req.user.name || 'Approving Authority'
        };

        const result = await approvalService.processApprovalAction({
            requestId,
            action: actionType,
            user: userScope,
            comment,
            signatureData
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("ERROR IN handleApprovalAction:", error.stack);
        res.status(400).json({ success: false, error: error.message });
    }
};

// Actions matching requested POST endpoints
const recommendRequest = handleApprovalAction('RECOMMEND');
const approveRequest = handleApprovalAction('APPROVE');
const rejectRequest = handleApprovalAction('REJECT');
const implementRequest = handleApprovalAction('IMPLEMENT');
const returnRequest = handleApprovalAction('RETURN');

// Fetch history trace
const getApprovalHistory = async (req, res, next) => {
    try {
        const history = await approvalService.getApprovalHistory(req.params.requestId);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    recommendRequest,
    approveRequest,
    rejectRequest,
    implementRequest,
    returnRequest,
    getApprovalHistory
};
