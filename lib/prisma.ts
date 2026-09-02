import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

// Serverless ve Next.js ortamlarında connection sızıntısını önlemek için her zaman global nesnede tut
globalForPrisma.prisma = prisma;
