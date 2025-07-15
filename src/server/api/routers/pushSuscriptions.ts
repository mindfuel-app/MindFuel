import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import webpush from "web-push";
import { env } from "~/env.mjs";

webpush.setGCMAPIKey(env.GCMAPI_KEY);

const vapidKeys = {
  publicKey: env.PUBLIC_VAPID,
  privateKey: env.PRIVATE_VAPID,
};

webpush.setVapidDetails(
  "mailto:proyectotdahort@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const pushRouter = createTRPCRouter({
  addPush: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        PushSubscription: z.any(), // o z.object({...}) si tipás el objeto
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, PushSubscription } = input;

      const isAlreadySubscribed = await ctx.prisma.pushSubscription.findMany({
        where: {
          user_id: userId,
          suscription: JSON.stringify(PushSubscription),
        },
      });

      if (isAlreadySubscribed.length > 0) {
        return "user already Subscribed";
      }

      const pushSubscription = await ctx.prisma.pushSubscription.create({
        data: {
          user_id: userId,
          suscription: JSON.stringify(PushSubscription),
        },
      });

      return pushSubscription;
    }),

  sendPushToOne: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        title: z.string(),
        body: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pushSubscriptions = await ctx.prisma.pushSubscription.findMany({
        where: {
          user_id: input.user_id,
        },
      });

      const payload = JSON.stringify({
        title: input.title,
        body: input.body,
        url: input.url,
      });

      for (const push of pushSubscriptions) {
        try {
          const ps = JSON.parse(push.suscription) as webpush.PushSubscription;
          await webpush.sendNotification(ps, payload);
        } catch (error) {
          console.error("Error al enviar notificación:", error);
        }
      }

      return pushSubscriptions;
    }),
});
