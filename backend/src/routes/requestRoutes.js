const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    getAuditLogs
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Ensure all routes are protected
router.use(protect);

router.route('/')
    .post(authorize('Employee', 'IT Admin'), createRequest)
    .get(getRequests);

router.route('/:id')
    .get(getRequestById)
    .put(authorize('Employee', 'IT Admin'), updateRequest)
    .delete(authorize('IT Admin'), deleteRequest);

router.get('/:id/audit', authorize('HOD', 'Competent Authority', 'Network Admin', 'IT Admin'), getAuditLogs);

module.exports = router;
