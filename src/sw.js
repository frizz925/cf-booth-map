/* global workbox */
self.__precacheManifest = (self.__precacheManifest || []).concat([
  {
    url: '/index.html',
    revision: '{{ REVISION src/index.pug }}',
  },
]);

const cdnCaches = {
  unpkg: new RegExp('^https://unpkg\\.com/'),
  cdnjs: new RegExp('^https://cdnjs\\.cloudflare\\.com/'),
  google: new RegExp('^https://.+\\.googleapis\\.com/'),
  comifuro: new RegExp('^https://catalog\\.comifuro\\.net/'),
};

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL('/index.html'),
);

const cdnPlugins = [
  new workbox.cacheableResponse.Plugin({
    statuses: [0, 200],
  }),
];
const cdnStrategy = cacheName =>
  new workbox.strategies.CacheFirst({
    cacheName,
    plugins: cdnPlugins,
  });
Object.keys(cdnCaches).forEach(key => {
  const matcher = cdnCaches[key];
  const cacheName = `${key}-cache`;
  workbox.routing.registerRoute(matcher, cdnStrategy(cacheName), 'GET');
});
