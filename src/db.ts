import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const db = globalThis?.prisma || new PrismaClient();

// Log to check initialization

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

export { db }