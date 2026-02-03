import { Response, NextFunction } from 'express';
import { adminService } from '../services/adminService';
import { jwtUtils } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const authController = {
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      // Find admin by email
      const admin = await adminService.getAdminByEmail(email);

      if (!admin) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check if admin is active
      if (admin.status !== 'ACTIVE') {
        throw new AppError('Account is inactive', 403);
      }

      // Verify password
      const isPasswordValid = await adminService.verifyPassword(
        password,
        admin.passwordHash
      );

      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Update last login
      await adminService.updateLastLogin(admin.id);

      // Generate JWT token
      const token = jwtUtils.generateToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
      });

      res.json({
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.admin) {
        throw new AppError('Not authenticated', 401);
      }

      const admin = await adminService.getAdminById(req.admin.adminId);

      if (!admin) {
        throw new AppError('Admin not found', 404);
      }

      res.json(admin);
    } catch (error) {
      next(error);
    }
  },
};
