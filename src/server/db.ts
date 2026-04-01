import { PrismaClient } from "@prisma/client";
import { env } from "~/env.mjs";
import { resolveRuntimeDatabaseUrl } from "~/server/dbConfig";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolveRuntimeDatabaseUrl(),
      },
    },
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
