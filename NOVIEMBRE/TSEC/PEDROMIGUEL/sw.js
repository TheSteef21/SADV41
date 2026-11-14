self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : { title: '🚨 Alerta Sísmica Panamá', body: 'Nuevo evento detectado M≥2.5' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://leafletjs.com/docs/images/logo.png',
      vibrate: [200, 100, 200, 100, 200]
    })
  );
});
