import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

export interface DealsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  store?: string;
  minDiscount?: number;
  maxPrice?: number;
  q?: string;
  status?: string;
}

export const dealService = {
  async getDeals(params: DealsQueryParams) {
    const {
      page = 1,
      limit = 12,
      category,
      store,
      minDiscount,
      maxPrice,
      q,
      status = 'PUBLISHED',
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.DealWhereInput = {
      status: status as any,
      ...(minDiscount && { discountPercent: { gte: minDiscount } }),
      ...(maxPrice && { dealPrice: { lte: maxPrice } }),
      ...(q && {
        OR: [
          { title: { contains: q } },
          { shortDescription: { contains: q } },
        ],
      }),
    };

    // Filter by category slug
    if (category) {
      where.dealCategories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    // Filter by store slug
    if (store) {
      where.store = {
        slug: store,
      };
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          },
          dealCategories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          dealTags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.deal.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      deals,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getDealBySlug(slug: string) {
    const deal = await prisma.deal.findUnique({
      where: { slug },
      include: {
        store: true,
        dealCategories: {
          include: {
            category: true,
          },
        },
        dealTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return deal;
  },

  async getDealById(id: number) {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        store: true,
        dealCategories: {
          include: {
            category: true,
          },
        },
        dealTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return deal;
  },

  async recordClick(dealId: number, metadata: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    subId?: string;
  }) {
    const click = await prisma.dealClick.create({
      data: {
        dealId,
        ...metadata,
      },
    });

    return click;
  },

  async createDeal(data: Prisma.DealCreateInput) {
    const deal = await prisma.deal.create({
      data,
      include: {
        store: true,
        dealCategories: {
          include: {
            category: true,
          },
        },
        dealTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return deal;
  },

  async updateDeal(id: number, data: Prisma.DealUpdateInput) {
    const deal = await prisma.deal.update({
      where: { id },
      data,
      include: {
        store: true,
        dealCategories: {
          include: {
            category: true,
          },
        },
        dealTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return deal;
  },

  async deleteDeal(id: number) {
    // Soft delete by setting status to ARCHIVED
    const deal = await prisma.deal.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return deal;
  },

  async addDealCategories(dealId: number, categoryIds: number[]) {
    const dealCategories = await prisma.dealCategory.createMany({
      data: categoryIds.map(categoryId => ({
        dealId,
        categoryId,
      })),
      skipDuplicates: true,
    });

    return dealCategories;
  },

  async addDealTags(dealId: number, tagIds: number[]) {
    const dealTags = await prisma.dealTag.createMany({
      data: tagIds.map(tagId => ({
        dealId,
        tagId,
      })),
      skipDuplicates: true,
    });

    return dealTags;
  },

  async removeDealCategories(dealId: number, categoryIds?: number[]) {
    if (categoryIds) {
      await prisma.dealCategory.deleteMany({
        where: {
          dealId,
          categoryId: { in: categoryIds },
        },
      });
    } else {
      await prisma.dealCategory.deleteMany({
        where: { dealId },
      });
    }
  },

  async removeDealTags(dealId: number, tagIds?: number[]) {
    if (tagIds) {
      await prisma.dealTag.deleteMany({
        where: {
          dealId,
          tagId: { in: tagIds },
        },
      });
    } else {
      await prisma.dealTag.deleteMany({
        where: { dealId },
      });
    }
  },
};
