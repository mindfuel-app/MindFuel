import { appRouter } from "~/server/api/root";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createTRPCContext } from "~/server/api/trpc";

// Create the tRPC handler for App Router
const handler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});

export { handler as GET, handler as POST };
