/* SADV41 · service worker mínimo para mostrar avisos de sismos */
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('notificationclick',function(e){
  e.notification.close();
  var u=(e.notification.data&&e.notification.data.url)||'/SADV41/NOVIEMBRE/TSEC/';
  e.waitUntil(self.clients.openWindow(u));
});
