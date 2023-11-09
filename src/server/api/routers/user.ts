import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getTheme: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const theme = await ctx.prisma.user.findUnique({
        where: {
          id: input.user_id,
        },
        select: {
          theme: true,
        },
      });
      return theme;
    }),
  updateTheme: protectedProcedure
    .input(z.object({ user_id: z.string(), theme: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const theme = await ctx.prisma.user.update({
        where: {
          id: input.user_id,
        },
        data: {
          theme: input.theme,
        },
      });
      return theme;
    }),
});
