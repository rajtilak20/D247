import prisma from '../db/prisma';
import bcrypt from 'bcrypt';

export const adminService = {
  async getAdminByEmail(email: string) {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    return admin;
  },

  async getAdminById(id: number) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin;
  },

  async createAdmin(data: {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'EDITOR';
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const admin = await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || 'EDITOR',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin;
  },

  async verifyPassword(plainPassword: string, passwordHash: string) {
    return bcrypt.compare(plainPassword, passwordHash);
  },

  async updateLastLogin(id: number) {
    await prisma.admin.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },
};
