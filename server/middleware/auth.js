import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Verifies the JWT sent as `Authorization: Bearer <token>` and attaches the
// user to req.user. Used to protect any route that needs a logged-in user.
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-passwordHash');

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized — user no longer exists');
  }
  next();
});

// Restricts a route to one or more roles, e.g. authorize('admin') or
// authorize('volunteer', 'admin'). Must run after protect.
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error(`Forbidden — requires role: ${roles.join(' or ')}`));
  }
  next();
};
