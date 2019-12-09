/* global workbox */
self.__precacheManifest = (self.__precacheManifest || [])
  .filter(cache => {
    const url = typeof cache === 'object' ? cache.url : cache;
    return !url.startsWith('/api/');
  })
  .concat(['/index.html']);

const { Plugin: CacheablePlugin } = workbox.cacheableResponse;
const { Plugin: BroadcastPlugin } = workbox.broadcastUpdate;
const {
  addPlugins,
  precacheAndRoute,
  cleanupOutdatedCaches,
  getCacheKeyForURL,
} = workbox.precaching;
const { registerNavigationRoute, registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;

const cdnCaches = {
  unpkg: new RegExp('^https://unpkg\\.com/'),
  cdnjs: new RegExp('^https://cdnjs\\.cloudflare\\.com/'),
  google: new RegExp('^https://.+\\.googleapis\\.com/'),
  comifuro: new RegExp('^https://catalog\\.comifuro\\.net/'),
};

workbox.core.skipWaiting();
workbox.core.clientsClaim();

addPlugins([new BroadcastPlugin('precache-updates')]);
precacheAndRoute(self.__precacheManifest, {});
registerNavigationRoute(getCacheKeyForURL('/index.html'));

registerRoute(
  new RegExp('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [new BroadcastPlugin('api-updates')],
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

const cleanupStorageCaches = () =>
  new Promise(resolve => {
    caches.keys().then(keys => {
      Promise.all(keys.map(key => caches.delete(key))).then(resolve);
    });
  });

self.addEventListener('message', evt => {
  if (!evt.data || evt.data.type !== 'CACHE_CLEANUP') {
    return;
  }
  cleanupOutdatedCaches();
  cleanupStorageCaches().then(() => {
    evt.ports[0].postMessage({ type: 'CACHE_CLEANED_UP' });
  });
});
