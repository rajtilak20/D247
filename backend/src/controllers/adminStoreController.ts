import { Response, NextFunction } from 'express';
import { storeService } from '../services/storeService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const adminStoreController = {
  async createStore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        name,
        slug,
        logoUrl,
        websiteUrl,
        affiliateProgramName,
        affiliateBaseUrl,
        status,
      } = req.body;

      if (!name || !slug || !websiteUrl) {
        throw new AppError('Missing required fields', 400);
      }

      const store = await storeService.createStore({
        name,
        slug,
        logoUrl,
        websiteUrl,
        affiliateProgramName,
        affiliateBaseUrl,
        status: status || 'ACTIVE',
      });

      res.status(201).json(store);
    } catch (error) {
      next(error);
    }
  },

  async updateStore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const storeId = parseInt(id);

      const existingStore = await storeService.getStoreById(storeId);
      if (!existingStore) {
        throw new AppError('Store not found', 404);
      }

      const store = await storeService.updateStore(storeId, req.body);

      res.json(store);
    } catch (error) {
      next(error);
    }
  },

  async deleteStore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const storeId = parseInt(id);

      const existingStore = await storeService.getStoreById(storeId);
      if (!existingStore) {
        throw new AppError('Store not found', 404);
      }

      await storeService.deleteStore(storeId);

      res.json({ success: true, message: 'Store deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};
