// src/lib/db.ts
// Production database access client using Prisma ORM
export { prisma, prisma as db } from "./prisma";
export type { PrismaClient } from "@prisma/client";
