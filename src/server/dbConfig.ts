import { env } from "~/env.mjs";

const supabasePoolerHostSuffix = ".pooler.supabase.com";

const ensureParam = (url: URL, key: string, value: string) => {
  if (!url.searchParams.has(key)) {
    url.searchParams.set(key, value);
  }
};

const normalizeSupabasePoolerUrl = (input: string) => {
  let parsed: URL;

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

export const resolveRuntimeDatabaseUrl = () => {
  return normalizeSupabasePoolerUrl(env.DATABASE_URL);
};
