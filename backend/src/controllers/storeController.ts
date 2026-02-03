import { Request, Response, NextFunction } from 'express';
import { storeService } from '../services/storeService';

export const storeController = {
  async getStores(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const stores = await storeService.getStores(status as string);
      res.json(stores);
    } catch (error) {
      next(error);
    }
  },
};
