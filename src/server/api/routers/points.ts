import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { error } from "console";

export const pointsRouter = createTRPCRouter({
  addPoints: protectedProcedure
    .input(z.object({ user_id: z.string(), points: z.number() }))
    .mutation(async ({ ctx, input }) => {
        const userPoints = await ctx.prisma.user.findUnique({
        where: {
          id: input.user_id,
        },
        select: {
          puntos: true,
        },
      });
      if (!userPoints) return error("Error: no user found");
      const puntos = userPoints.puntos += input.points;
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: input.user_id,
        },
        data: {
          puntos: puntos,
        },
      });
      return updatedUser;
    }),
  getPoints: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userPoints = await ctx.prisma.user.findUnique({
        where: {
          id: input.user_id,
        },
        select: {
          puntos: true,
        },
      });
      if (!userPoints) return error("Error: no user found");
      return userPoints;
    })
});

      