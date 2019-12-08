/* global workbox */
self.__precacheManifest = (self.__precacheManifest || []).concat([
  {
    url: '/index.html',
    revision: '{{ REVISION src/index.pug }}',
  },
]);

const { skipWaiting, clientsClaim } = workbox.core;
const { Plugin: CacheablePlugin } = workbox.cacheableResponse;
const { Plugin: BroadcastPlugin } = workbox.broadcastUpdate;
const { precacheAndRoute, getCacheKeyForURL } = workbox.precaching;
const { registerNavigationRoute, registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;

const cdnCaches = {
  unpkg: new RegExp('^https://unpkg\\.com/'),
  cdnjs: new RegExp('^https://cdnjs\\.cloudflare\\.com/'),
  google: new RegExp('^https://.+\\.googleapis\\.com/'),
  comifuro: new RegExp('^https://catalog\\.comifuro\\.net/'),
};

skipWaiting();
clientsClaim();

precacheAndRoute(self.__precacheManifest, {});

registerNavigationRoute(getCacheKeyForURL('/index.html'));

registerRoute(
  /api/,
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [new BroadcastPlugin({ channelName: 'api-updates' })],
  }),
  'GET',
);

Object.keys(cdnCaches).forEach(key =>
  registerRoute(
    cdnCaches[key],
    new CacheFirst({
      cacheName: `${key}-cache`,
      plugins: [new CacheablePlugin({ statuses: [0, 200] })],
    }),
    'GET',
  ),
);
