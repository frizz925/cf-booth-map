import Axios from 'axios';
import 'regenerator-runtime/runtime';
import WebFont from 'webfontloader';
import { Workbox } from 'workbox-window';
import './scss/main.scss';

interface WorkboxMessage {
  meta: string;
  type: string;
  payload: {
    cacheName: string;
    updatedURL: string;
  };
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

const handleNewVersion = async () => {
  // tslint:disable-next-line:no-console
  console.log('Detected new version, reloading...');
  // FIXME: confirm() is a bad UX approach
  if (!confirm("There's a new updated version. Click OK to refresh.")) {
    return;
  }
  // HACK: Flush all caches before reloading
  const keys = await caches.keys();
  let counter = 0;
  keys.forEach(async key => {
    await caches.delete(key);
    if (++counter >= keys.length) {
      window.location.reload();
    }
  });
};

const registerWorkboxListeners = (wb: Workbox) => {
  wb.addEventListener('activated', event => {
    if (event.isUpdate) {
      handleNewVersion();
    }
  });

  wb.addEventListener('message', event => {
    const data = event.data as WorkboxMessage;
    if (data.type === 'CACHE_UPDATED') {
      handleNewVersion();
    }
  });
};

const startPeriodicUpdateCheck = () => {
  setInterval(async () => {
    const now = new Date().toLocaleTimeString('en-US');
    const res = await Axios.get('/api/revision');
    // tslint:disable-next-line:no-console
    console.log(now, 'Revision from API:', res.data);
  }, 3000);
};

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    registerWorkboxListeners(wb);
    wb.register();
    startPeriodicUpdateCheck();
  }
});
