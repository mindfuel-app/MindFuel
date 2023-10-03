import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const routineRouter = createTRPCRouter({
  createRoutine: protectedProcedure
    .input(
      z.object({
        routine: z.object({
          name: z.string(),
          category: z.string().optional(),
          user_id: z.string(),
          days: z.string(),
          tasks: z
            .object({
              name: z.string(),
              estimated_time: z.number().nullable(),
              usesAI: z.boolean(),
              routine_order: z.number(),
            })
            .array(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, category, user_id, days, tasks } = input.routine;

      const createdRoutine = await ctx.prisma.routine.create({
        data: {
          name,
          category,
          user_id,
          days,
        },
      });
      const createdTasks = await Promise.all(
        tasks.map(async (task) => {
          return await ctx.prisma.task.create({
            data: {
              ...task,
              user_id,
              routine_id: createdRoutine.id,
            },
          });
        })
      );
      return { createdRoutine, createdTasks };
    }),
  modifyRoutine: protectedProcedure
    .input(
      z.object({
        routine: z.object({
          id: z.string(),
          name: z.string(),
          category: z.string().optional(),
          user_id: z.string(),
          days: z.string(),
          tasks: z
            .object({
              name: z.string(),
              estimated_time: z.number().nullable(),
              usesAI: z.boolean(),
              routine_order: z.number(),
            })
            .array(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, category, user_id, days, id, tasks } = input.routine;
      const editedRoutine = await ctx.prisma.routine.update({
        data: {
          name,
          category,
          user_id,
          days,
        },
        where: {
          id,
        },
      });
      await ctx.prisma.task.deleteMany({
        where: {
          routine_id: id,
        },
      });
      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          return await ctx.prisma.task.create({
            data: {
              ...task,
              user_id,
              routine_id: editedRoutine.id,
            },
          });
        })
      );
      return { editedRoutine, updatedTasks };
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
  getRoutineById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const routine = await ctx.prisma.routine.findUnique({
        where: {
          id: input.id,
        },
      });
      return routine;
    }),

  deleteRoutine: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedRoutine = await ctx.prisma.routine.delete({
        where: {
          id: input.id,
        },
      });
      const deletedTasks = await ctx.prisma.task.deleteMany({
        where: {
          routine_id: input.id,
        },
      });

      return { deletedRoutine, deletedTasks };
    }),
});
