const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/login', login);

// Protected Routes
router.get('/profile', protect, getProfile);

module.exports = router;
