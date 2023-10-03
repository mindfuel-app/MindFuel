import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { error } from "console";

type Task = {
  id: string;
  name: string;
  description: string | null;
  deadline: Date | null;
  done: boolean;
};

function sortTasksByDeadline(a: Task, b: Task): number {
  if (a.deadline === null && b.deadline !== null) {
    return 1;
  }
  if (a.deadline !== null && b.deadline === null) {
    return -1;
  }
  if (a.deadline && b.deadline) {
    const deadlineComparison = a.deadline.getTime() - b.deadline.getTime();
    if (deadlineComparison !== 0) {
      return deadlineComparison;
    }
  }
  return 0;
}

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      z.object({
        task: z.object({
          name: z.string(),
          description: z.string().nullable(),
          deadline: z.date().nullable(),
          user_id: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const task = input.task;
      if (!task) return error("No tasks provided");
      const createdTask = await ctx.prisma.task.create({
        data: task,
      });
      return createdTask;
    }),
  getTasks: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: {
          user_id: input.user_id,
        },
        select: {
          id: true,
          name: true,
          deadline: true,
          description: true,
          done: true,
        },
      });

      return tasks
        .sort(sortTasksByDeadline)
        .sort((a, b) => Number(a.done) - Number(b.done));
    }),
  getTasksForRoutine: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: {
          user_id: input.user_id,
          routine_id: {
            not: null,
          },
          routine_order: {
            not: null,
          },
        },
        select: {
          name: true,
          estimated_time: true,
          usesAI: true,
          routine_id: true,
          routine_order: true,
        },
      });

      return tasks.map((task) => {
        return {
          name: task.name,
          estimatedTime: task.estimated_time,
          usesAI: task.usesAI,
          routineId: task.routine_id,
          routineOrder: task.routine_order || 0,
        };
      });
    }),
  getTasksbyRoutine: protectedProcedure
    .input(z.object({ routine_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: {
          routine_id: input.routine_id,
          routine_order: {
            not: null,
          },
        },
      });
      return tasks.sort((a, b) => {
        if (a.routine_order === null || b.routine_order === null) return 0;
        return a.routine_order - b.routine_order;
      });
    }),
  getTaskById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: {
          id: input.id,
        },
      });
      return task;
    }),
  setTaskDone: protectedProcedure
    .input(z.object({ task_id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.update({
        where: {
          id: input.task_id,
        },
        data: {
          done: true,
        },
      });
      return task;
    }),

  setTaskUndone: protectedProcedure
    .input(z.object({ tasks: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      const tasks = input.tasks;
      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          await ctx.prisma.task.update({
            where: {
              id: task,
            },
            data: {
              done: false,
            },
          });
        })
      );
      return updatedTasks;
    }),

  modifyTask: protectedProcedure
    .input(
      z.object({
        task: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullish(),
          deadline: z.date().nullish(),
          routine_id: z.string().nullish(),
          user_id: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = input.task;
      const editedTask = await ctx.prisma.task.update({
        data: task,
        where: {
          id: task.id,
        },
      });
      return editedTask;
    }),
  updateTaskTime: protectedProcedure
    .input(z.object({ id: z.string(), estimated_time: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.update({
        data: {
          estimated_time: input.estimated_time,
        },
        where: {
          id: input.id,
        },
      });
      return task;
    }),
  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.delete({
        where: {
          id: input.id,
        },
      });
      return task;
    }),
});
