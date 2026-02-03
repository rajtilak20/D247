import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

export const tagService = {
  async getTags() {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });

    return tags;
  },

  async getTagById(id: number) {
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    return tag;
  },

  async getTagBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
    });

    return tag;
  },

  async createTag(data: Prisma.TagCreateInput) {
    const tag = await prisma.tag.create({
      data,
    });

    return tag;
  },

  async updateTag(id: number, data: Prisma.TagUpdateInput) {
    const tag = await prisma.tag.update({
      where: { id },
      data,
    });

    return tag;
  },

  async deleteTag(id: number) {
    const tag = await prisma.tag.delete({
      where: { id },
    });

    return tag;
  },
};
