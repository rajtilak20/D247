import { Request, Response, NextFunction } from 'express';
import { dealService } from '../services/dealService';
import { AppError } from '../middleware/errorHandler';

export const dealController = {
  async getDeals(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page,
        limit,
        category,
        store,
        minDiscount,
        maxPrice,
        q,
      } = req.query;

      const result = await dealService.getDeals({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        category: category as string,
        store: store as string,
        minDiscount: minDiscount ? parseFloat(minDiscount as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        q: q as string,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getDealBySlugOrId(req: Request, res: Response, next: NextFunction) {
    try {
      const { idOrSlug } = req.params;

      let deal;

      // Check if it's a number (ID) or string (slug)
      if (/^\d+$/.test(idOrSlug)) {
        deal = await dealService.getDealById(parseInt(idOrSlug));
      } else {
        deal = await dealService.getDealBySlug(idOrSlug);
      }

      if (!deal) {
        throw new AppError('Deal not found', 404);
      }

      res.json(deal);
    } catch (error) {
      next(error);
    }
  },

  async recordClick(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dealId = parseInt(id);

      // Check if deal exists
      const deal = await dealService.getDealById(dealId);
      if (!deal) {
        throw new AppError('Deal not found', 404);
      }

      // Extract metadata from request
      const metadata = {
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer'] || req.headers['referrer'],
        subId: req.body.subId,
      };

      await dealService.recordClick(dealId, metadata);

      res.json({
        success: true,
        affiliateUrl: deal.affiliateUrl,
      });
    } catch (error) {
      next(error);
    }
  },
};
