const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, 'abc123');
        next();
    } catch (error){
        return res.status(401).json({
            message: 'Token verification failed!'
        });
    }
}