/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
self.addEventListener("push", (event) => {
  if (!event.target) return "error";
  const data = event.data.json();
  console.log("New notification", data);
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "./favicon.ico",
  });
});
