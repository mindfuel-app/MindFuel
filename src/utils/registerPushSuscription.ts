export async function subscribeUserToPush() {
  try {
    const registration = await navigator.serviceWorker.register("/push-sw.js");

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        "BJw57keq3mApSgaxzVzpdNMmViHi4EG5zTXalzO3ktWP4PXDHHW0qXTCfrJuZYF4ehzGI6yOI1jATxXcfo2W5Ww",
    });

    // Enviar al backend (ajustar URL o usar TRPC si corresponde)
    await fetch("/api/push-subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Push subscription registrada con éxito");
  } catch (error) {
    console.error("Error al registrar el service worker o la suscripción:", error);
  }
}
