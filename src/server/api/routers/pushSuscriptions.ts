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

// Tipo de la suscripción para validación
interface PushSubscriptionObject {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Validador para confirmar que es una suscripción válida
function isValidSubscription(obj: any): obj is PushSubscriptionObject {
  return (
    obj &&
    typeof obj.endpoint === "string" &&
    obj.keys &&
    typeof obj.keys.p256dh === "string" &&
    typeof obj.keys.auth === "string"
  );
}

export const pushRouter = createTRPCRouter({
  addPush: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        PushSubscription: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, PushSubscription } = input;

      const alreadyExists = await ctx.prisma.pushSubscription.findMany({
        where: {
          user_id: userId,
          suscription: JSON.stringify(PushSubscription),
        },
      });

      if (alreadyExists.length > 0) {
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
          let raw = push.suscription;
          if (typeof raw === "string") raw = JSON.parse(raw);
          if (typeof raw === "string") raw = JSON.parse(raw);

          if (!isValidSubscription(raw)) {
            console.warn("❗ Suscripción inválida (estructura incorrecta):", raw);
            continue;
          }

          await webpush.sendNotification(raw, payload);
        } catch (error: any) {
          console.error("❌ Error al enviar notificación:", error);

          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log("🗑️ Eliminando suscripción expirada");
            try {
              await ctx.prisma.pushSubscription.delete({
                where: { id: push.id },
              });
            } catch (deleteErr) {
              console.warn("⚠️ No se pudo eliminar la suscripción:", deleteErr);
            }
          }
        }
      }

      return { success: true };
    }),
});
