//workbox.setConfig({ debug: false });
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL('index.html')
);
