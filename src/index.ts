import AppPresenter from '@presenters/AppPresenter';
import { IS_PRODUCTION } from '@utils/Constants';
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

  console.log('Detected new version');
  const message = "There's a new updated version. Click OK to refresh.";
  const confirmed = await presenter.confirm(message);
  if (!confirmed) {
    reloadInProgress = false;
    return;
  }

  // HACK: Flush all caches before reloading (there's got to be a better way than this)
  console.log('Flushing caches...');
  const keys = await caches.keys();
  let counter = 0;
  keys.forEach(async key => {
    await caches.delete(key);
    if (++counter >= keys.length) {
      console.log('Reloading...');
      window.location.reload();
    }
  });
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
  const now = new Date().toLocaleTimeString('en-US');
  const res = await Axios.get('/api/version');
  // tslint:disable-next-line:no-console
  console.log(now, 'Revision from API:', res.data);
};

const startPeriodicUpdateCheck = () => {
  // Periodically check every hour
  setInterval(updateCheck, 3600 * 1000);
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
  async ({ default: app }) => {
    const presenter = app(document.getElementById('app'));
    if (IS_PRODUCTION) {
      if (document.readyState === 'complete') {
        registerServiceWorker(presenter);
      } else {
        window.addEventListener('load', () => registerServiceWorker(presenter));
      }
    }
    const result = await presenter.confirm('This is a confirmation dialog');
    // tslint:disable-next-line:no-console
    console.log(result);
  },
  err => console.error(err),
);
