self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => self.clients.claim());
self.addEventListener("push", (e) => {
  const data = e.data ? e.data.json() : { title: "🚨 Alerta Sísmica Panamá", body: "Nuevo evento M>=2.5 detectado" };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "https://thesteef21.github.io/SADV41/favicon.ico",
      vibrate: [200, 100, 200],
      badge: "https://thesteef21.github.io/SADV41/favicon.ico"
    })
  );
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow("https://thesteef21.github.io/SADV41/NOVIEMBRE/TSEC/"));
});
