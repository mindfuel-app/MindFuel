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
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const routine = input.routine;
      if (!routine) return error("Error: no routine uploaded");
      const createdRoutine = await ctx.prisma.routine.create({
        data: routine,
      });
      return createdRoutine;
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
