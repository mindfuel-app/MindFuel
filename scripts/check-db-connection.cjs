#!/usr/bin/env node

const { PrismaClient } = require("@prisma/client");

const supabasePoolerHostSuffix = ".pooler.supabase.com";

/**
 * @param {URL} url
 * @param {string} key
 * @param {string} value
 */
const ensureParam = (url, key, value) => {
  if (!url.searchParams.has(key)) {
    url.searchParams.set(key, value);
  }
};

/**
 * @param {string} input
 */
const normalizeSupabasePoolerUrl = (input) => {
  let parsed;

  try {
    parsed = new URL(input);
  } catch {
    return input;
  }

  if (!parsed.hostname.endsWith(supabasePoolerHostSuffix)) {
    return input;
  }

  if (parsed.port === "5432") {
    parsed.port = "6543";
  }

  ensureParam(parsed, "sslmode", "require");
  ensureParam(parsed, "pgbouncer", "true");
  ensureParam(parsed, "connection_limit", "1");

  return parsed.toString();
};

const sourceUrl = process.env.DATABASE_URL;

if (!sourceUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const runtimeDatabaseUrl = normalizeSupabasePoolerUrl(sourceUrl);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: runtimeDatabaseUrl,
    },
  },
  log: ["error", "warn"],
});

const safeUrl = (() => {
  try {
    const parsed = new URL(runtimeDatabaseUrl);
    if (parsed.password) {
      parsed.password = "********";
    }
    return parsed.toString();
  } catch {
    return "[invalid DATABASE_URL]";
  }
})();

const run = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection check passed.");
    console.log(`Target: ${safeUrl}`);
    process.exit(0);
  } catch (error) {
    console.error("Database connection check failed.");
    console.error(`Target: ${safeUrl}`);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

void run();
