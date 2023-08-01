import { createTRPCRouter } from "~/server/api/trpc";
import { resetPwdRouter } from "./routers/resetPwd";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  resetPwd: resetPwdRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
