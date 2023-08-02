import { createTRPCRouter } from "~/server/api/trpc";
import { resetPwdRouter } from "./routers/resetPwd";
import { taskRouter } from "./routers/task";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tasks: taskRouter,
  resetPwd: resetPwdRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
