import { PrismaClient } from "@prisma/client";

// Next.js hot-reloads modules in development, which would normally create
// a fresh PrismaClient (and a fresh set of database connections) on every
// single file save. Stashing the instance on `globalThis` means dev mode
// reuses the same client across reloads instead of leaking connections.
// In production this global is simply never touched — one instance is
// created and lives for the process lifetime.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}