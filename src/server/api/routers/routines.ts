import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { error } from "console";

export const routineRouter = createTRPCRouter({
  createRoutine: protectedProcedure
    .input(
      z.object({
        routine: z.object({
          name: z.string(),
          description: z.string().optional(),
          user_id: z.string(),
          days: z.string(),
          tasks: z
            .object({
              name: z.string(),
              description: z.string().nullish(),
              category: z.string().nullish(),
              routine_id: z.string().nullish(),
              event_id: z.string().nullish(),
              estimatedtime: z.number().nullish(),
              done: z.boolean(),
              user_id: z.string(),
              requiredenergy: z.number().nullish(),
            })
            .array(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const routine = input.routine;
      if (!routine) return error("Error: no routine uploaded");
      const createdRoutine = await ctx.prisma.routine.create({
        data: {
          name: routine.name,
          description: routine.description,
          user_id: routine.user_id,
          days: routine.days,
        },
      });
      const createdTasks = await Promise.all(
        routine.tasks.map(async (task) => {
          task.routine_id = createdRoutine.id;
          return await ctx.prisma.task.create({
            data: task,
          });
        })
      );
      return { createdRoutine, createdTasks };
    }),
  getRoutines: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const routines = await ctx.prisma.routine.findMany({
        where: {
          user_id: input.user_id,
        },
      });
      return routines;
    }),
  modifyRoutine: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        user_id: z.string(),
        days: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const editedRoutine = await ctx.prisma.routine.update({
        data: {
          name: input.name,
          description: input.description,
          user_id: input.user_id,
          days: input.days,
        },
        where: {
          id: input.id,
        },
      });
      return editedRoutine;
    }),
  deleteRoutine: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedRoutine = await ctx.prisma.routine.delete({
        where: {
          id: input.id,
        },
      });
      return deletedRoutine;
    }),
});
