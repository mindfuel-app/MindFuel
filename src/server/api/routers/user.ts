import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  editUsername: protectedProcedure
    .input(z.object({ user_id: z.string(), username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const alreadyExists = await ctx.prisma.user.findUnique({
        where: {
          name: input.username,
        },
      });
      if (alreadyExists) {
        throw new Error("Username already exists");
      }
      const user = await ctx.prisma.user.update({
        where: {
          id: input.user_id,
        },
        data: {
          name: input.username,
        },
      });
      return user;
    }),
  getJoinedDate: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.user_id,
        },
        select: {
          createdAt: true,
        },
      });

      const month = user?.createdAt.toLocaleString("es-ES", {
        month: "long",
      });
      const year = user?.createdAt.getFullYear();

      return { month, year };
    }),
  getCompletedTasks: protectedProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const count = await ctx.prisma.task.count({
        where: {
          user_id: input.user_id,
          done: true,
        },
      });

      return count;
    }),
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
