import { AppError } from '../utils/appError.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};