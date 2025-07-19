import { createTRPCRouter } from "~/server/api/trpc";
import { resetPwdRouter } from "./routers/resetPwd";
import { taskRouter } from "./routers/task";
import { routineRouter } from "./routers/routines";
import { pointsRouter } from "./routers/points";
import { notesRouter } from "./routers/notes";
import { profilePicRouter } from "./routers/profilePic";
import { selfCareRouter } from "./routers/selfCare";
import { userRouter } from "./routers/user";


export const appRouter = createTRPCRouter({
  tasks: taskRouter,
  routines: routineRouter,
  resetPwd: resetPwdRouter,
  points: pointsRouter,
  notes: notesRouter,
  profilePic: profilePicRouter,
  selfCare: selfCareRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
