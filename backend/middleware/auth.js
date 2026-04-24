const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findOne({ _id: decoded.id });

        if (!user) throw new Error();

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ error: 'Access denied. Admins only.' });
    }
};

module.exports = { auth, adminAuth };
