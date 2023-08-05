import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { now } from "next-auth/client/_utils";
import { error } from "console";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      z.object({
        tasks: z.object({
          name: z.string(),
          description: z.string().optional(),
          category: z.string().optional(),
          user_id: z.string(),
          routine_id: z.string().optional(),
          event_id: z.string().optional(),
          requiredenergy: z.number().optional(),
          estimatedtime: z.number().optional(),
        }).array()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tasks = input.tasks;
      if (!tasks) return error("No tasks provided");
      const createdTasks = await Promise.all(tasks.map(async (task) => {
        return await ctx.prisma.task.create({
          data: task
        });
      }));
      return createdTasks;
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
      return tasks;
    }),

  setTaskDone: protectedProcedure
    .input(z.object({ task_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const createdAt = await ctx.prisma.task.findUnique({
        where: {
          id: input.task_id,
        },
        select: {
          createdAt: true,
        },
      });
      if (!createdAt) return error("No task found");
      const realTime = now() - createdAt.createdAt.getTime();
      const task = await ctx.prisma.task.update({
        where: {
          id: input.task_id,
        },
        data: {
          done: true,
          real_time: realTime,
        },
      });
      return task;
    }),
  // modifyTask: protectedProcedure
  //   .input(
  //     z.object({
  //       taskId: z.string(),
  //       field: z.string(),
  //       value: z.string().optional(),
  //       numValue: z.number().optional()
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const id = input.taskId
  //     const field = input.field
  //     const value = input.value
  //     const numValue = input.numValue
  //     if (!numValue) {
  //       ctx.prisma.task.update({
  //         data: {
  //           field : value
  //         },
  //         where: {
  //           id
  //         }
  //       })
  //       return ctx.prisma.task.findUnique({ where: { id } })
  //     }
  //     if (!value) {
  //       ctx.prisma.task.update({
  //         data: {
  //           field : numValue
  //         },
  //         where: {
  //           id
  //         }
  //       })
  //       return ctx.prisma.task.findUnique({ where: { id } })
  //     }

  //   })
});
