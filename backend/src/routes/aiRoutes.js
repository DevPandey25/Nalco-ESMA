const express = require('express');
const router = express.Router();
const { askAssistant, getApprovalAssistantAdvice, getDepartmentInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/chat', askAssistant);
router.post('/advisor', getApprovalAssistantAdvice);
router.get('/insights', getDepartmentInsights);

module.exports = router;
