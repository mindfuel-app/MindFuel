import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { error } from "console";

export const pointsRouter = createTRPCRouter({
  addPoints: protectedProcedure
    .input(z.object({ user_id: z.string(), points: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { user_id, points } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        return error("Error: no user found");
      }

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          puntos: {
            increment: points,
          },
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
          levelNumber: true,
        },
      });

      if (!userPoints) return error("Error: no user found");

      let prevLevel = await ctx.prisma.level.findUnique({
        where: {
          number: userPoints.levelNumber - 1,
        },
        select: {
          number: true,
          points: true,
        },
      });

      while (prevLevel && userPoints.puntos > prevLevel.points) {
        userPoints.levelNumber = prevLevel.number - 1;
        prevLevel = await ctx.prisma.level.findUnique({
          where: {
            number: userPoints.levelNumber - 1,
          },
          select: {
            number: true,
            points: true,
          },
        });
      }

      let nextLevel = await ctx.prisma.level.findUnique({
        where: {
          number: userPoints.levelNumber + 1,
        },
        select: {
          number: true,
          points: true,
        },
      });

      while (nextLevel && userPoints.puntos >= nextLevel.points) {
        userPoints.levelNumber = nextLevel.number;
        nextLevel = await ctx.prisma.level.findUnique({
          where: {
            number: userPoints.levelNumber + 1,
          },
          select: {
            number: true,
            points: true,
          },
        });
      }

      const currentLevelPoints = await ctx.prisma.level.findUnique({
        where: {
          number: userPoints.levelNumber,
        },
        select: {
          points: true,
        },
      });

      await ctx.prisma.user.update({
        where: {
          id: input.user_id,
        },
        data: {
          levelNumber: userPoints.levelNumber,
        },
      });

      return {
        ...userPoints,
        currentLevelPoints: currentLevelPoints?.points,
        nextLevelPoints: nextLevel?.points,
      };
    }),
});
