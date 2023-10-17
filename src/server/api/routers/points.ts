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
        },
      });
      if (!userPoints) return error("Error: no user found");
      return userPoints;
    }),
});
