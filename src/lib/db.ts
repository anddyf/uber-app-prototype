import { PrismaClient } from "@prisma/client";
<<<<<<< HEAD

export const db =
  (globalThis as any).prisma ||
  new PrismaClient({
    log: ["error", "warn"], // optional
  });

if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = db;
=======
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
>>>>>>> master
