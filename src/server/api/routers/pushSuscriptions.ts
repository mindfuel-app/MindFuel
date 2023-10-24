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
  "mailto:proyectotdahort@gmail.com" as string,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const pushRouter = createTRPCRouter({
  addPush: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        PushSubscription: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, PushSubscription } = input;
      const isAlreadySubscribed = await ctx.prisma.pushSubscription.findMany({
        where: {
          user_id: input.userId,
          suscription: input.PushSubscription,
        },
      });
      if (isAlreadySubscribed.length !== 0) {
        console.log(isAlreadySubscribed);
        return "user already Subscribed";
      } else {
        const pushSubscription = await ctx.prisma.pushSubscription.create({
          data: {
            user_id: userId,
            suscription: PushSubscription,
          },
        });
        console.log(pushSubscription);
        return pushSubscription;
      }
    }),

  sendPushToOne: publicProcedure
    .input(
      z.object({ user_id: z.string(), title: z.string(), body: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const pushSubscriptions = await ctx.prisma.pushSubscription.findMany({
        where: {
          user_id: input.user_id,
        },
      });
      console.log(pushSubscriptions);
      pushSubscriptions.forEach((pushSubscription) => {
        const payload = JSON.stringify({
          title: input.title,
          //body: input.body,
          body: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
        });

        const ps = JSON.parse(
          pushSubscription.suscription
        ) as webpush.PushSubscription;
        console.log(ps);
        console.log(
          webpush
            .sendNotification(ps, payload)
            .catch((error) => console.error(error))
        );
      });
      return pushSubscriptions;
    }),
});
