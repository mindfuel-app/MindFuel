import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const selfCareRouter = createTRPCRouter({
  createGreetings: protectedProcedure
    .input(
      z.object({
        greetings: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const values = await ctx.prisma.greeting.create({
        data: {
          user_id: ctx.session.user.id,
          greeting: input.greetings,
        },
      });
      return { values };
    }),
  getGreetings: protectedProcedure.query(async ({ ctx }) => {
    const values = await ctx.prisma.greeting.findMany({
      where: {
        user_id: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return values;
  }),
  createNote: protectedProcedure
    .input(
      z.object({
        note: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const values = await ctx.prisma.note.create({
        data: {
          user_id: ctx.session.user.id,
          note: input.note,
        },
      });
      return values;
    }),
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    const values = await ctx.prisma.note.findMany({
      where: {
        user_id: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return values;
  }),
  deleteNote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const values = await ctx.prisma.note.deleteMany({
        where: {
          id: input.id,
          user_id: ctx.session.user.id,
        },
      });
      return values;
    }),
});
