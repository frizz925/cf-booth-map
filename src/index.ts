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

let reloadInProgress = false;
const handleNewVersion = async (presenter: AppPresenter, cb?: () => Promise<void>) => {
  if (reloadInProgress) {
    return;
  }
  reloadInProgress = true;
  const message = "There's a new updated version.\nClick OK to refresh.";
  const result = await presenter.confirm(message);
  if (!result) {
    return;
  }
  if (cb) {
    await cb();
  }
  reloadInProgress = false;
  window.location.reload();
};

const triggerCacheCleanup = (wb: Workbox) => wb.messageSW({ type: 'CACHE_CLEANUP' });

// tslint:disable:no-console
const registerWorkboxListeners = (wb: Workbox, presenter: AppPresenter) => {
  wb.addEventListener('activated', event => {
    if (!event.isUpdate) {
      presenter.snackbar('Service worker activated. This app can now work offline');
      return;
    }
    handleNewVersion(presenter, () => triggerCacheCleanup(wb));
  });

  wb.addEventListener('message', event => {
    const data = event.data as WorkboxMessage;
    if (data.type === 'CACHE_UPDATED') {
      handleNewVersion(presenter);
    }
  });
};
// tslint:enable:no-console

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
  // updateCheck();
};

const registerServiceWorker = (presenter: AppPresenter) => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    registerWorkboxListeners(wb, presenter);
    wb.register();
    startPeriodicUpdateCheck();

    (window as any).loadNewVersion = async () => {
      handleNewVersion(presenter, () => triggerCacheCleanup(wb));
    };
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

    (window as any).snackbar = (message: string, action?: string) => {
      return presenter.snackbar(message, action);
    };
  },
  err => console.error(err),
);
