import { Response, NextFunction } from 'express';
import { tagService } from '../services/tagService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const adminTagController = {
  async createTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, slug } = req.body;

      if (!name || !slug) {
        throw new AppError('Missing required fields', 400);
      }

      const tag = await tagService.createTag({
        name,
        slug,
      });

      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  },

  async updateTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tagId = parseInt(id);

      const existingTag = await tagService.getTagById(tagId);
      if (!existingTag) {
        throw new AppError('Tag not found', 404);
      }

      const tag = await tagService.updateTag(tagId, req.body);

      res.json(tag);
    } catch (error) {
      next(error);
    }
  },

  async deleteTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tagId = parseInt(id);

      const existingTag = await tagService.getTagById(tagId);
      if (!existingTag) {
        throw new AppError('Tag not found', 404);
      }

      await tagService.deleteTag(tagId);

      res.json({ success: true, message: 'Tag deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
};
