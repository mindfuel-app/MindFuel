import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { error } from "console";

export const friendRouter = createTRPCRouter({
  searchFriends: protectedProcedure
    .input(z.object({ userName: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          name: input.userName,
        },
      });

      if (!user) return error("Error: no user found");

      return user;
    }),

    sendRequest: protectedProcedure
    .input(z.object({ userId: z.string(), friendId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const friend = await ctx.prisma.user.findUnique({
        where: {
          id: input.friendId,
        },
      });

      if (!friend) return error("Error: no user found");

      const request = await ctx.prisma.friend.create({
        data: {
          id_first: input.userId,
          id_second: input.friendId,
          accepted: false,
        },
      });

      return request;
    }),

    acceptRequest: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.friend.update({
        where: {
          id: input.requestId,
        },
        data: {
          accepted: true,
        },
      });

      return request;
    }),
    
})