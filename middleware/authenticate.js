require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.userId);
        if (!req.user) {
          return res.status(401).json({ message: 'User not found' });
        }
        if (req.user.status === 'banned') {
      return res.status(403).json({ message: 'Access denied. User is banned.' });
    }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
