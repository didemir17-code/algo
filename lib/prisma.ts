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

/**
 * Serverless ortamlarda anlık connection yoğunluğu yaşandığında
 * isteğin düşmemesi için otomatik yeniden deneme (retry) sarmalayıcısı.
 */
export async function withDbRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 300): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: unknown) {
      attempt++;
      const msg = err instanceof Error ? err.message : String(err);
      if (
        attempt <= retries &&
        (msg.includes('connections') || msg.includes('connection') || msg.includes('pool') || msg.includes('FATAL'))
      ) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        continue;
      }
      throw err;
    }
  }
}
