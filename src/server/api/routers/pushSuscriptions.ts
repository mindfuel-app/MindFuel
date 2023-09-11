import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import "web-push" // Typescript doesn't recognize web-push as a module, so we need to import it like this
// import webpush from 'web-push';
import { env } from "~/env.mjs";

const vapidKeys = {
  publicKey: env.PUBLIC_VAPID,
  privateKey: env.PRIVATE_VAPID
};
// webpush.setVapidDetails(
//   'mailto:proyectotdahort@gmail.com',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey,
// );

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

    // sendPushToOne: publicProcedure
    // .input(z.object({ user_id: z.string(), title: z.string(), body: z.string() }))
    // .mutation(async ({ ctx, input }) => {
    //   const pushSubscriptions = await ctx.prisma.pushSubscription.findMany({
    //     where: {
    //       user_id: input.user_id
    //     }});
      
    //   pushSubscriptions.forEach(pushSubscription => {
    //     const payload = JSON.stringify({
    //       title: input.title,
    //       body: input.body,
    //     });
    //     webpush.sendNotification(pushSubscription.suscription, payload).catch((error) => console.error(error));
    //   });
    //   return pushSubscriptions;
    // }),

  });
