const jwt = require('jsonwebtoken');

async function authenticateToken(request, h) {
    try {
        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return h.response({ message: 'Token is required' }).code(401);
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        
        return h.continue;
    } catch (error) {
        return h.response({ message: 'Invalid token' }).code(403);
    }
}

module.exports = authenticateToken;
