import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) throw new Error();

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

export const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Admin access denied.' });
    }
    next();
};

export const instructorAuth = (req, res, next) => {
    if (req.user.role !== 'instructor') {
        return res.status(403).send({ error: 'Instructor access denied.' });
    }
    if (req.user.isBlocked) {
        return res.status(403).send({ error: 'Your account has been suspended. Please contact the administrator.', code: 'BLOCKED' });
    }
    if (!req.user.isApproved) {
        return res.status(403).send({ error: 'Your account is pending admin approval.', code: 'PENDING_APPROVAL' });
    }
    next();
};
