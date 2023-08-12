import { createTRPCRouter } from "~/server/api/trpc";
import { resetPwdRouter } from "./routers/resetPwd";
import { taskRouter } from "./routers/task";
import { routineRouter } from "./routers/routines";
import { pointsRouter } from "./routers/points";
import { friendRouter } from "./routers/friends";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tasks: taskRouter,
  routines: routineRouter,
  resetPwd: resetPwdRouter,
  points: pointsRouter,
  friends: friendRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
