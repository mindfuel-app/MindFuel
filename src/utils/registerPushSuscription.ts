import { useUser } from "~/lib/UserContext";
import { api } from "~/utils/api";

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

export function askPermission(userId:string) {
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
      subscribeUserToPush(userId).catch((err) => {
        alert(err);
      });
    }
  });
}

function subscribeUserToPush(userId:string) {
  return navigator.serviceWorker
    .register('./push-sw.js')
    .then(function (registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: "BJw57keq3mApSgaxzVzpdNMmViHi4EG5zTXalzO3ktWP4PXDHHW0qXTCfrJuZYF4ehzGI6yOI1jATxXcfo2W5Ww",
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function (pushSubscription) {
      console.log(pushSubscription)
    });
}