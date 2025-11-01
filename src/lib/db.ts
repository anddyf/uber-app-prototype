import { PrismaClient } from "@prisma/client";

export const db =
  (globalThis as any).prisma ||
  new PrismaClient({
    log: ["error", "warn"], // optional
  });

if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = db;
