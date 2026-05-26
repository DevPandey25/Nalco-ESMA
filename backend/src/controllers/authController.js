const User = require('../models/userModel');
const { comparePassword, generateToken } = require('../utils/securityUtils');

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { personalNo, password, role } = req.body;

        if (!personalNo || !password || !role) {
            return res.status(400).json({ error: 'Please provide personal number, password, and role' });
        }

        // Find user by personalNo or email
        const user = await User.findOne({ 
            $or: [{ personalNo }, { email: personalNo }] 
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid personal number or password' });
        }

        // Verify password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid personal number or password' });
        }

        // Verify role matches
        if (user.role !== role) {
            return res.status(401).json({ error: `Selected role does not match user registry` });
        }

        // Return token and details
        res.json({
            id: user._id,
            name: user.name,
            personalNo: user.personalNo,
            role: user.role,
            token: generateToken(user)
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (user) {
            res.json({
                id: user._id,
                name: user.name,
                personalNo: user.personalNo,
                role: user.role
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Profile fetch error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    login,
    getProfile
};
