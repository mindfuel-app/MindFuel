// @ts-nocheck
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  console.log("Push recibido:", data);

  const notificationOptions = {
    body: data.body,
    icon: "./favicon.ico",
    image: "./favicon.ico",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "MindFuel", notificationOptions)
  );
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification?.data?.url || "/";
  console.log("Redirigiendo a:", url);

  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(url)
  );
});
