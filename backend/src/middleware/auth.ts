import { Request, Response, NextFunction } from 'express';
import { jwtUtils } from '../utils/jwt';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  admin?: {
    adminId: number;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwtUtils.verifyToken(token);

    // Attach admin info to request
    req.admin = decoded;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', 401));
    }
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.admin?.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
