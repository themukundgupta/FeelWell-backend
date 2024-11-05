import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import { AppError } from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid token. Please log in again.', 401));
  }
};