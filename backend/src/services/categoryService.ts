import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

export const categoryService = {
  async getCategories() {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        parent: true,
        children: true,
      },
    });

    return categories;
  },

  async getCategoryById(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    return category;
  },

  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
      },
    });

    return category;
  },

  async createCategory(data: Prisma.CategoryCreateInput) {
    const category = await prisma.category.create({
      data,
    });

    return category;
  },

  async updateCategory(id: number, data: Prisma.CategoryUpdateInput) {
    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return category;
  },

  async deleteCategory(id: number) {
    const category = await prisma.category.delete({
      where: { id },
    });

    return category;
  },
};
