import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const selfCareRouter = createTRPCRouter({
  createGreetings: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        greetings: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const values = await ctx.prisma.greeting.create({
        data: {
          user_id: input.user_id,
          greeting: input.greetings,
        },
      });
      return { values };
    }),
  getGreetings: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const values = await ctx.prisma.greeting.findMany({
        where: {
          user_id: input.user_id,
        },
      });
      return values;
    }),
  getWater: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const values = await ctx.prisma.water.findFirst({
        where: {
          user_id: input.user_id,
        },
      });
      return values;
    }),
  updateWater: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        water: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const alreadyHasWater = await ctx.prisma.water.findFirst({
        where: {
          user_id: input.user_id,
        },
      });
      if (!alreadyHasWater) {
        const values = await ctx.prisma.water.create({
          data: {
            user_id: input.user_id,
            water: input.water,
          },
        });
        return { values };
      }
      const values = await ctx.prisma.water.update({
        where: {
          user_id: input.user_id,
        },
        data: {
          water: input.water,
        },
      });
      return values;
    }),
  createNote: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        note: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const values = await ctx.prisma.note.create({
        data: {
          user_id: input.user_id,
          note: input.note,
        },
      });
      return values;
    }),
  getNotes: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const values = await ctx.prisma.note.findMany({
        where: {
          user_id: input.user_id,
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
      const values = await ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
      });
      return values;
    }),
});
