import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { error } from "console";

type Task = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  createdAt: Date;
  deadline: Date | null;
  usesAI:boolean;
  routine_id: string | null;
  event_id: string | null;
  required_energy: number | null;
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
        tasks: z
          .object({
            name: z.string(),
            description: z.string().nullish(),
            category: z.string().nullish(),
            deadline: z.date().nullish(),
            usesAI: z.boolean(),
            routine_id: z.string().nullish(),
            event_id: z.string().nullish(),
            estimated_time: z.number().nullish(),
            done: z.boolean(),
            user_id: z.string(),
            requiredenergy: z.number().nullish(),
          })
          .array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const tasks = input.tasks;
      if (!tasks) return error("No tasks provided");
      const createdTasks = await Promise.all(
        tasks.map(async (task) => {
          return await ctx.prisma.task.create({
            data: task,
          });
        })
      );
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
      let orderedTasks = tasks.sort(sortTasksByDeadline);
      orderedTasks = tasks.sort((a, b) => Number(a.done) - Number(b.done));
      return orderedTasks;
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
    .input(z.object({ task_id: z.string(), realTime: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const realTime = input.realTime;
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
              real_time: null,
            },
          });
        })
      );
      return updatedTasks;
    }),

  modifyTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        deadline: z.string().optional(),
        usesAI: z.boolean(),
        routine_id: z.string().optional(),
        event_id: z.string().optional(),
        estimated_time: z.number().optional(),
        done: z.boolean(),
        user_id: z.string(),
        requiredenergy: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.update({
        data: {
          name: input.name,
          description: input.description,
          category: input.category,
          routine_id: input.routine_id,
          event_id: input.event_id,
          estimated_time: input.estimated_time,
          done: input.done,
          user_id: input.user_id,
          required_energy: input.requiredenergy,
        },
        where: {
          id: input.taskId,
        },
      });
      return task;
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
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.delete({
        where: {
          id: input.taskId,
        },
      });
      return task;
    }),
});
