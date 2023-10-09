self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('New notification', data);
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "./favicon.ico"
    });
  });
