import AppPresenter from '@presenters/AppPresenter';
import { IS_PRODUCTION } from '@utils/Constants';
import Axios from 'axios';
import 'regenerator-runtime/runtime';
import WebFont from 'webfontloader';
import { Workbox } from 'workbox-window';
import './scss/main.scss';

const isLocalhost = window.location.hostname === 'localhost';
const checkType = isLocalhost ? 'Revision' : 'Version';
const checkEndpoint = isLocalhost ? '/api/revision' : '/api/version';
const checkInterval = isLocalhost ? 3000 : 3600 * 1000;

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

import('./map').then(
  ({ default: map }) => {
    map(document.getElementById('stage'));
  },
  err => console.error(err),
);

// tslint:disable:no-console
let reloadInProgress = false;
const handleNewVersion = async (presenter: AppPresenter) => {
  if (reloadInProgress) {
    return;
  }
  reloadInProgress = true;

  // HACK: Flush all caches before reloading (there's got to be a better way than this)
  console.log('Detected new version, flushing caches...');
  const keys = await caches.keys();
  let counter = 0;
  await new Promise(resolve => {
    keys.forEach(async key => {
      await caches.delete(key);
      if (++counter >= keys.length) {
        resolve();
      }
    });
  });
  console.log('Caches flushed.');

  const message = "There's a new updated version.\nClick OK to refresh.";
  if (await presenter.confirm(message)) {
    console.log('Refreshing...');
    window.location.reload();
  }
  reloadInProgress = false;
};
// tslint:enable:no-console

const registerWorkboxListeners = (wb: Workbox, presenter: AppPresenter) => {
  wb.addEventListener('activated', event => {
    if (event.isUpdate) {
      handleNewVersion(presenter);
    }
  });

  wb.addEventListener('message', event => {
    const data = event.data as WorkboxMessage;
    if (data.type === 'CACHE_UPDATED') {
      handleNewVersion(presenter);
    }
  });
};

const updateCheck = async () => {
  const now = new Date().toLocaleString('en-US');
  const res = await Axios.get(checkEndpoint);
  // tslint:disable-next-line:no-console
  console.log(now, checkType, 'from API:', res.data);
};

const startPeriodicUpdateCheck = () => {
  // Periodically check in interval
  setInterval(updateCheck, checkInterval);
  // Run the initial check
  updateCheck();
};

const registerServiceWorker = (presenter: AppPresenter) => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    registerWorkboxListeners(wb, presenter);
    wb.register();
    startPeriodicUpdateCheck();
  }
};

import('./app').then(
  ({ default: app }) => {
    const presenter = app(document.getElementById('app'));
    if (IS_PRODUCTION) {
      if (document.readyState === 'complete') {
        registerServiceWorker(presenter);
      } else {
        window.addEventListener('load', () => registerServiceWorker(presenter));
      }
    }
  },
  err => console.error(err),
);
