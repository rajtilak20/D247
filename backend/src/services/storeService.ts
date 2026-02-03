import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

export const storeService = {
  async getStores(status?: string) {
    const where: Prisma.StoreWhereInput = status
      ? { status: status as any }
      : {};

    const stores = await prisma.store.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return stores;
  },

  async getStoreById(id: number) {
    const store = await prisma.store.findUnique({
      where: { id },
    });

    return store;
  },

  async getStoreBySlug(slug: string) {
    const store = await prisma.store.findUnique({
      where: { slug },
    });

    return store;
  },

  async createStore(data: Prisma.StoreCreateInput) {
    const store = await prisma.store.create({
      data,
    });

    return store;
  },

  async updateStore(id: number, data: Prisma.StoreUpdateInput) {
    const store = await prisma.store.update({
      where: { id },
      data,
    });

    return store;
  },

  async deleteStore(id: number) {
    const store = await prisma.store.delete({
      where: { id },
    });

    return store;
  },
};
