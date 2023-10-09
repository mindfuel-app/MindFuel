/* eslint-disable @typescript-eslint/ban-ts-comment */
self.addEventListener('push', event => {
  // @ts-ignore
  const data = JSON.parse(event.data)
  console.log('New notification', data);

  // @ts-ignore
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "./favicon.ico"
    });
  });

  