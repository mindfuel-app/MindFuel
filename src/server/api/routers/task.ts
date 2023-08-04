import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { now } from "next-auth/client/_utils";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        routine_id: z.string().optional(),
        event_id: z.string().optional(),
        estimated_time: z.number().optional(),
        required_energy: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        description,
        category,
        routine_id,
        event_id,
        estimated_time,
        required_energy,
      } = input;
      const task = await ctx.prisma.task.create({
        data: {
          name,
          description,
          category,
          createdAt: new Date(now()),
          routine_id,
          event_id,
          estimated_time,
          done: false,
          real_time: null,
          user_id: ctx.session.user.id,
          required_energy,
        },
      });
      return { task };
    }),
  getTasks: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: {
          user_id: input.user_id,
        },
      });
      return tasks;
    }),
  getTasksbyRoutine: protectedProcedure
    .input(z.object({ routine_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: {
          routine_id: input.routine_id,
        },
      });
      return { tasks };
    }),
});
