import Axios from 'axios';
import 'regenerator-runtime/runtime';
import WebFont from 'webfontloader';
import './scss/main.scss';

interface UpdatePayload {
  cacheName: string;
  updatedUrl: string;
}

WebFont.load({
  google: {
    families: ['Roboto:300,400,500'],
  },
});

import('./app').then(
  ({ default: app }) => {
    app(document.getElementById('app'));
  },
  err => console.error(err),
);

import('./map').then(
  ({ default: map }) => {
    map(document.getElementById('stage'));
  },
  err => console.error(err),
);

const registerUpdatesListener = () => {
  const channel = new BroadcastChannel('index-updates');
  channel.addEventListener('message', async event => {
    const { cacheName, updatedUrl } = event.data.payload as UpdatePayload;
    const cache = await caches.open(cacheName);
    const response = await cache.match(updatedUrl);
    if (response) {
      // FIXME: Abruptly reloading on update is a bad UX
      window.location.reload();
    }
  });
};

window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      // tslint:disable-next-line:no-console
      console.log('SW Registration success:', reg);
      registerUpdatesListener();
    } catch (err) {
      console.error('SW Registration failed:', err);
    }
  }

  const res = await Axios.get('/api/version');
  // tslint:disable-next-line:no-console
  console.log('Version from API:', res.data);
});
