import { PrismaClient } from "@prisma/client";

declare global {
  var db: PrismaClient | undefined;
}

const db = globalThis?.db || new PrismaClient();

// Log to check initialization

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}

export { db }