import mongoose from 'mongoose';
import { fail } from '../utils/apiResponse.js';

export function notFound(req, res) {
  return fail(res, `Route not found: ${req.originalUrl}`, 404);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';

  if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = 'Invalid resource id';
  }

  if (err.code === 11000) {
    status = 409;
    message = 'Duplicate value';
  }

  const details = process.env.NODE_ENV === 'production' ? undefined : err.details || err.stack;
  return fail(res, message, status, details);
}

