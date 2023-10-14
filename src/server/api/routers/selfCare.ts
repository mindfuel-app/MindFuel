import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const selfCareRouter = createTRPCRouter({
  clearValues: publicProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }) => {
      const deleted = await ctx.prisma.selfCare.deleteMany();
      return { deleted };
    }),
  getValues: protectedProcedure
  .input(z.object({
    user_id: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const values = await ctx.prisma.selfCare.findMany({
      where: {
        user_id: input.user_id,
      },
    });
    return { values };
  }),
  })

