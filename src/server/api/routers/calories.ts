import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { date, z } from "zod";

interface calorie {
  id: string;
  user_id: string;
  calories: number;
  date: Date;
}

export const caloriesRouter = createTRPCRouter({
  getTodaysCalories: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const calories = await ctx.prisma.calorie.findMany({
        where: {
          user_id: input.userId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
            lt: new Date(new Date().setHours(23, 59, 59, 999)), // End of today 
          }
        },
      });
      return calories;
    }),

  addCalorie: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        calories: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const calorie = await ctx.prisma.calorie.create({
        data: {
          user_id: input.userId,
          calories: input.calories,
        },
      });

      return calorie;
    }),

  deleteCalorie: protectedProcedure
    .input(z.object({ calorieId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const calorie = await ctx.prisma.calorie.delete({
        where: {
          id: input.calorieId,
        },
      });

      return calorie;
    }),

});


