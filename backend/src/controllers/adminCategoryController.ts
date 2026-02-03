import { Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const adminCategoryController = {
  async createCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, slug, parentId, sortOrder } = req.body;

      if (!name || !slug) {
        throw new AppError('Missing required fields', 400);
      }

      const categoryData: any = {
        name,
        slug,
        sortOrder: sortOrder || 0,
      };

      if (parentId) {
        categoryData.parent = { connect: { id: parentId } };
      }

      const category = await categoryService.createCategory(categoryData);

      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);

      const existingCategory = await categoryService.getCategoryById(categoryId);
      if (!existingCategory) {
        throw new AppError('Category not found', 404);
      }

      const { name, slug, parentId, sortOrder } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (slug !== undefined) updateData.slug = slug;
      if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
      if (parentId !== undefined) {
        updateData.parent = parentId ? { connect: { id: parentId } } : { disconnect: true };
      }

      const category = await categoryService.updateCategory(categoryId, updateData);

      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);

      const existingCategory = await categoryService.getCategoryById(categoryId);
      if (!existingCategory) {
        throw new AppError('Category not found', 404);
      }

      await categoryService.deleteCategory(categoryId);

      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};
