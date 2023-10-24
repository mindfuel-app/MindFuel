import { useEffect, useState } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>();

  useEffect(() => {
    void Notification.requestPermission().then(setPermission);
  }, []);

  return permission;
}
