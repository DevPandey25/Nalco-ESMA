const { verifyToken } = require('../utils/securityUtils');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token using security utility
            const decoded = verifyToken(token);

            // Add user scope to request
            req.user = { 
                id: decoded.id,
                role: decoded.role,
                name: decoded.name,
                personalNo: decoded.personalNo
            };

            // Development Role Override
            if (process.env.NODE_ENV !== 'production' && req.headers['x-role-override']) {
                const overriddenRole = req.headers['x-role-override'];
                req.user.role = overriddenRole;
                
                // Sync name and personalNo to keep dev testing completely coherent
                if (overriddenRole === 'Employee') {
                    req.user.personalNo = '10845';
                    req.user.name = 'Probina Kumar Ray';
                } else if (overriddenRole === 'HOD') {
                    req.user.personalNo = '2001';
                    req.user.name = 'A. K. Das';
                } else if (overriddenRole === 'Competent Authority') {
                    req.user.personalNo = '3001';
                    req.user.name = 'R. Mohanty';
                } else if (overriddenRole === 'Network Admin') {
                    req.user.personalNo = '4001';
                    req.user.name = 'Prakash Behera';
                } else if (overriddenRole === 'IT Admin') {
                    req.user.personalNo = '5001';
                    req.user.name = 'ESMA System Admin';
                }
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Forbidden: User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
