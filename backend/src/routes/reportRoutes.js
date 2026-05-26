const express = require('express');
const router = express.Router();
const { getAnalytics, exportReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/export', exportReports);

module.exports = router;
