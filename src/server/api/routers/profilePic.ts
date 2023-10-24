import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const profilePicRouter = createTRPCRouter({
    getIds: protectedProcedure
    .query(async ({ ctx }) => {
        const ids = await ctx.prisma.picture.findMany({
            select: {
            id: true,
            },
        });
    
        return ids;
    }),

    getPicUrl: protectedProcedure
    .input(z.object({ picId: z.string() }))
    .query(async ({ ctx, input }) => {
      const picUrl = await ctx.prisma.picture.findUnique({
        where: {
          id: input.picId,
        },
        select:{
          pictureUrl: true,
        }
      });

      return picUrl;
    }),

    setProfilePic: protectedProcedure
    .input(z.object({ userId: z.string(), picUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pic = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          image: input.picUrl,
        },
      });

      return pic;
    }),
});