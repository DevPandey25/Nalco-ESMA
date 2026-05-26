const express = require('express');
const router = express.Router();
const {
    recommendRequest,
    approveRequest,
    rejectRequest,
    implementRequest,
    returnRequest,
    getApprovalHistory
} = require('../controllers/approvalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/recommend', authorize('HOD', 'IT Admin'), recommendRequest);
router.post('/approve', authorize('Competent Authority', 'IT Admin'), approveRequest);
router.post('/reject', authorize('HOD', 'Competent Authority', 'IT Admin'), rejectRequest);
router.post('/implement', authorize('Network Admin', 'IT Admin'), implementRequest);
router.post('/return', authorize('HOD', 'IT Admin'), returnRequest);

router.get('/history/:requestId', authorize('Employee', 'HOD', 'Competent Authority', 'Network Admin', 'IT Admin'), getApprovalHistory);

module.exports = router;
