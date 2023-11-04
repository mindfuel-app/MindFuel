/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
var data;
self.addEventListener("push", (event) => {
  if (!event.target) return "error";
  data = event.data.json();
  console.log(data);
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "./favicon.ico",
      Image: "./favicon.ico",
    })
  );
});
self.addEventListener('notificationclick', (event) => {
  const url=data.url;
  console.log(url);
  event.waitUntil(self.clients.openWindow(""+url));
  event.notification.close();
});
