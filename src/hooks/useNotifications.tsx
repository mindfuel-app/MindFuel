import { useEffect, useState } from "react";
import { subscribeUserToPush } from "~/utils/registerPushSuscription";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>();

  useEffect(() => {
    const init = async () => {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        await subscribeUserToPush(); // se encarga de registrar y suscribir
      }
    };

    void init();
  }, []);

  return permission;
}
