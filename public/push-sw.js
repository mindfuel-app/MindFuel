self.addEventListener('push', event => {
  const data = JSON.parse(event.data)
  console.log('New notification', data);

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "./favicon.ico"
    });
  });
