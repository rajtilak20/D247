import { Response, NextFunction } from 'express';
import { dealService } from '../services/dealService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const adminDealController = {
  async createDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.admin) {
        throw new AppError('Not authenticated', 401);
      }

      const {
        title,
        slug,
        storeId,
        shortDescription,
        longDescription,
        productImageUrl,
        productUrl,
        affiliateUrl,
        couponCode,
        originalPrice,
        dealPrice,
        currency,
        discountPercent,
        startsAt,
        expiresAt,
        status,
        isFeatured,
        categoryIds,
        tagIds,
      } = req.body;

      // Validate required fields
      if (!title || !slug || !storeId || !shortDescription || !affiliateUrl || !originalPrice || !dealPrice) {
        throw new AppError('Missing required fields', 400);
      }

      // Create the deal
      const deal = await dealService.createDeal({
        title,
        slug,
        shortDescription,
        longDescription,
        productImageUrl,
        productUrl,
        affiliateUrl,
        couponCode,
        originalPrice,
        dealPrice,
        currency: currency || 'INR',
        discountPercent: discountPercent || ((originalPrice - dealPrice) / originalPrice * 100),
        startsAt: startsAt ? new Date(startsAt) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        status: status || 'DRAFT',
        isFeatured: isFeatured || false,
        store: {
          connect: { id: storeId },
        },
        creator: {
          connect: { id: req.admin.adminId },
        },
      });

      // Add categories if provided
      if (categoryIds && categoryIds.length > 0) {
        await dealService.addDealCategories(deal.id, categoryIds);
      }

      // Add tags if provided
      if (tagIds && tagIds.length > 0) {
        await dealService.addDealTags(deal.id, tagIds);
      }

      // Fetch the complete deal with relations
      const completeDeal = await dealService.getDealById(deal.id);

      res.status(201).json(completeDeal);
    } catch (error) {
      next(error);
    }
  },

  async updateDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dealId = parseInt(id);

      const {
        title,
        slug,
        storeId,
        shortDescription,
        longDescription,
        productImageUrl,
        productUrl,
        affiliateUrl,
        couponCode,
        originalPrice,
        dealPrice,
        currency,
        discountPercent,
        startsAt,
        expiresAt,
        status,
        isFeatured,
        categoryIds,
        tagIds,
      } = req.body;

      // Check if deal exists
      const existingDeal = await dealService.getDealById(dealId);
      if (!existingDeal) {
        throw new AppError('Deal not found', 404);
      }

      // Update the deal
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
      if (longDescription !== undefined) updateData.longDescription = longDescription;
      if (productImageUrl !== undefined) updateData.productImageUrl = productImageUrl;
      if (productUrl !== undefined) updateData.productUrl = productUrl;
      if (affiliateUrl !== undefined) updateData.affiliateUrl = affiliateUrl;
      if (couponCode !== undefined) updateData.couponCode = couponCode;
      if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
      if (dealPrice !== undefined) updateData.dealPrice = dealPrice;
      if (currency !== undefined) updateData.currency = currency;
      if (discountPercent !== undefined) updateData.discountPercent = discountPercent;
      if (startsAt !== undefined) updateData.startsAt = startsAt ? new Date(startsAt) : null;
      if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
      if (status !== undefined) updateData.status = status;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (storeId !== undefined) updateData.store = { connect: { id: storeId } };

      const deal = await dealService.updateDeal(dealId, updateData);

      // Update categories if provided
      if (categoryIds !== undefined) {
        await dealService.removeDealCategories(dealId);
        if (categoryIds.length > 0) {
          await dealService.addDealCategories(dealId, categoryIds);
        }
      }

      // Update tags if provided
      if (tagIds !== undefined) {
        await dealService.removeDealTags(dealId);
        if (tagIds.length > 0) {
          await dealService.addDealTags(dealId, tagIds);
        }
      }

      // Fetch the complete updated deal
      const updatedDeal = await dealService.getDealById(dealId);

      res.json(updatedDeal);
    } catch (error) {
      next(error);
    }
  },

  async deleteDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dealId = parseInt(id);

      // Check if deal exists
      const existingDeal = await dealService.getDealById(dealId);
      if (!existingDeal) {
        throw new AppError('Deal not found', 404);
      }

      await dealService.deleteDeal(dealId);

      res.json({ success: true, message: 'Deal archived successfully' });
    } catch (error) {
      next(error);
    }
  },

  async getAllDeals(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        page,
        limit,
        category,
        store,
        minDiscount,
        maxPrice,
        q,
        status,
      } = req.query;

      const result = await dealService.getDeals({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        category: category as string,
        store: store as string,
        minDiscount: minDiscount ? parseFloat(minDiscount as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        q: q as string,
        status: status as string, // Admin can see all statuses
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
