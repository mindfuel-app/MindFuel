import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const selfCareRouter = createTRPCRouter({
  createWater: protectedProcedure
  .input(z.object({
    user_id: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const values = await ctx.prisma.water.create({
      data: {
        user_id: input.user_id,
      },
    });
    return { values };
  }),

  createGreetings: protectedProcedure
  .input(z.object({
    user_id: z.string(),
    greetings: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const values = await ctx.prisma.greeting.create({
      data: {
        user_id: input.user_id,
        greeting: input.greetings,
      },
    });
    return { values };
  }),

  getWater: protectedProcedure
  .input(z.object({
    user_id: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const values = await ctx.prisma.water.findFirst({
      where:{
        user_id: input.user_id
      }
    });
    return { values };
  }),

  getGreetings: protectedProcedure
  .input(z.object({
    user_id: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const values = await ctx.prisma.greeting.findMany({
      where:{
        user_id: input.user_id
      }
    });
    return { values };
  }),

  updateWater: protectedProcedure
  .input(z.object({
    user_id: z.string(),
    water: z.number(),
  }))
  .query(async ({ input, ctx }) => {
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
    return { values };
  }),
  })

