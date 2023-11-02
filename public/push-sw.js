/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
self.addEventListener("push", (event) => {
  if (!event.target) return "error";
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "./favicon.ico",
      Image: "./favicon.ico",
    })
  );
});
self.addEventListener('notificationclick', (event) => {
  const data = event.data.json();
  const url = data.url;
  event.waitUntil(self.clients.openWindow("/home?tab=rutinas"));
  event.notification.close();
});
