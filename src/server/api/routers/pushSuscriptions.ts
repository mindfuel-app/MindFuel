import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import webpush, { PushSubscription } from "web-push";
import { env } from "~/env.mjs";

// Configuración VAPID
webpush.setGCMAPIKey(env.GCMAPI_KEY);
webpush.setVapidDetails(
  "mailto:proyectotdahort@gmail.com",
  env.PUBLIC_VAPID,
  env.PRIVATE_VAPID
);

// Interfaz esperada para una suscripción válida
interface PushSubscriptionObject {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Validación de estructura
function isValidSubscription(obj: unknown): obj is PushSubscriptionObject {
  if (typeof obj !== "object" || obj === null) return false;

  const sub = obj as PushSubscriptionObject;
  return (
    typeof sub.endpoint === "string" &&
    sub.keys !== undefined &&
    typeof sub.keys.p256dh === "string" &&
    typeof sub.keys.auth === "string"
  );
}

export const pushRouter = createTRPCRouter({
  addPush: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        PushSubscription: z.any(), // Puedes refinarlo si querés con z.object({...})
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, PushSubscription } = input;

      const exists = await ctx.prisma.pushSubscription.findFirst({
        where: {
          user_id: userId,
          suscription: JSON.stringify(PushSubscription),
        },
      });

      if (exists) return "user already Subscribed";

      return await ctx.prisma.pushSubscription.create({
        data: {
          user_id: userId,
          suscription: JSON.stringify(PushSubscription),
        },
      });
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
      const subscriptions = await ctx.prisma.pushSubscription.findMany({
        where: { user_id: input.user_id },
      });

      const payload = JSON.stringify({
        title: input.title,
        body: input.body,
        url: input.url,
      });

      for (const push of subscriptions) {
        try {
          let parsed: unknown = push.suscription;

          if (typeof parsed === "string") parsed = JSON.parse(parsed);
          if (typeof parsed === "string") parsed = JSON.parse(parsed); // doble parse si fue serializado dos veces

          if (!isValidSubscription(parsed)) {
            console.warn("❗ Suscripción inválida:", parsed);
            continue;
          }

          await webpush.sendNotification(parsed, payload);
        } catch (err) {
          const error = err as { statusCode?: number };

          console.error("❌ Error al enviar notificación:", error);

          if (error?.statusCode === 410 || error?.statusCode === 404) {
            try {
              await ctx.prisma.pushSubscription.delete({
                where: { id: push.id },
              });
              console.log("🗑️ Suscripción eliminada por estar expirada");
            } catch (deleteErr) {
              console.warn("⚠️ No se pudo eliminar la suscripción:", deleteErr);
            }
          }
        }
      }

      return { success: true };
    }),
});
