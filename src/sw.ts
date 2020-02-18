const { clientsClaim, cacheNames } = workbox.core;
const { Plugin: CacheablePlugin } = workbox.cacheableResponse;
const { Plugin: BroadcastPlugin } = workbox.broadcastUpdate;
const {
  addPlugins,
  precacheAndRoute,
  cleanupOutdatedCaches,
  getCacheKeyForURL,
} = workbox.precaching;
const { NavigationRoute, registerRoute } = workbox.routing;
const { StaleWhileRevalidate, CacheFirst } = workbox.strategies;

type PrecacheManifest =
  | string
  | {
      url: string;
      revision: string;
    };

type WorkboxGlobalScope = ServiceWorkerGlobalScope & {
  __precacheManifest?: PrecacheManifest[];
};

interface CDNCaches {
  [key: string]: RegExp;
}

interface MessageHandlers {
  [key: string]: (port: MessagePort) => void;
}

const CIRCLE_CHUNKS = 13;

const cdnCaches: CDNCaches = {
  unpkg: new RegExp('^https://unpkg\\.com/'),
  cdnjs: new RegExp('^https://cdnjs\\.cloudflare\\.com/'),
  google: new RegExp('^https://.+\\.googleapis\\.com/'),
  comifuro: new RegExp('^https://catalog\\.comifuro\\.net/'),
};

const cleanupStorageCaches = () =>
  new Promise(resolve => {
    caches.keys().then(keys => {
      Promise.all(keys.map(key => caches.delete(key))).then(resolve);
    });
  });

const cacheUpdatesPlugin = new BroadcastPlugin({
  channelName: 'cache-updates',
  headersToCheck: ['ETag', 'Last-Modified'],
});

const range = (end: number) => {
  const results: number[] = [];
  for (let i = 0; i < end; i++) {
    results.push(i);
  }
  return results;
};

const circleData = () => range(CIRCLE_CHUNKS).map(chunk => `/api/circles-${chunk}.json`);
const mapImages = () => {
  const results: string[] = [];

  return results;
};

((service: WorkboxGlobalScope) => {
  service.__precacheManifest = (service.__precacheManifest || [])
    .filter(cache => {
      const url = typeof cache === 'object' ? cache.url : cache;
      return !url.startsWith('/api/');
    })
    .concat(['/index.html'], circleData())
    .reverse();

  clientsClaim();

  addPlugins([cacheUpdatesPlugin]);
  cleanupOutdatedCaches();
  precacheAndRoute(service.__precacheManifest, {});

  const cacheKey = getCacheKeyForURL('/index.html');
  const navigationRoute = new NavigationRoute(() =>
    caches.open(cacheNames.precache).then(cache => cache.match(cacheKey)),
  );
  registerRoute(navigationRoute);

  registerRoute(
    new RegExp('/api/'),
    new StaleWhileRevalidate({
      cacheName: 'api-cache',
      plugins: [cacheUpdatesPlugin],
    }),
    'GET',
  );

  const cdnCacheHandler = (name: string) =>
    new CacheFirst({
      cacheName: `${name}-cache`,
      plugins: [new CacheablePlugin({ statuses: [0, 200] })],
    });

  Object.keys(cdnCaches).forEach(key =>
    registerRoute(cdnCaches[key], cdnCacheHandler(key), 'GET'),
  );

  const messageHandlers: MessageHandlers = {
    CACHE_CLEANUP: port => {
      cleanupStorageCaches().then(() => {
        port.postMessage({ type: 'CACHE_CLEANED_UP' });
      });
    },
    SKIP_WAITING: () => service.skipWaiting(),
  };

  service.addEventListener('message', ({ data, ports }) => {
    if (!data || !data.type) {
      return;
    }
    const handler = messageHandlers[data.type];
    if (handler) {
      handler(ports[0]);
    }
  });
})(self as any);
