import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { error } from "console";

export const pushRouter = createTRPCRouter({
  addPush: protectedProcedure
    .input(z.object({ user_id: z.string(), PushSubscription: z.object(
      { endpoint: z.string(), keys: z.object({ p256dh: z.string(), auth: z.string() }) }
    ) }))
    .mutation(async ({ ctx, input }) => {
      const pushSubscription = await ctx.prisma.pushSubscription.create({
        data: {
          user_id: input.user_id,
          suscription: input.PushSubscription
          }
          });
      return pushSubscription;
    }),
  });
