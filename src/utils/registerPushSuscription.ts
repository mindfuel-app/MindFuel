export function registerServiceWorker() {
  return navigator.serviceWorker
    .register('./push-sw.js')
    .then(function (registration) {
      return registration;
    })
    .catch(function (err) {
      alert(err);
    });
}

export function askPermission() {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    }
    else if (permissionResult === 'granted') {
      subscribeUserToPush().catch((err) => {
        alert(err);
      });
    }
  });
}

function subscribeUserToPush() {
  return navigator.serviceWorker
    .register('./push-sw.js')
    .then(function (registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: "BAfc7r8bQIg9A6NXPHJzx72YzivmtEQ13CdnZviOHsL-mtf3k6W4YCMcEpsFjb3UGLhAslARg4koZf2I-OY82WQ",
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function (pushSubscription) {
      const suscription = pushSubscription;
      saveSuscriptionInDb(suscription);
    });
}

function saveSuscriptionInDb(suscription: object){
  console.log(suscription);
}