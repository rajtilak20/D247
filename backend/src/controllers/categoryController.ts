import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';

export const categoryController = {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },
};
