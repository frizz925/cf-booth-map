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

type UpdateCheckTask = () => void;

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

const loadMap = (presenter: AppPresenter) =>
  import('./map').then(
    ({ default: map }) => {
      map(presenter, document.getElementById('stage'));
    },
    err => console.error(err),
  );

let reloadInProgress = false;
const handleNewVersion = async (
  presenter: AppPresenter,
  message?: string,
  cb?: () => void,
) => {
  if (reloadInProgress) {
    return;
  }
  reloadInProgress = true;
  if (!message) {
    message = 'New version available, refresh to update';
  }
  const result = await presenter.confirm(message, 'Refresh');
  if (!result) {
    return;
  }
  if (cb) {
    cb();
  } else {
    window.location.reload();
  }
  reloadInProgress = false;
};

const triggerCacheCleanup = (wb: Workbox) => wb.messageSW({ type: 'CACHE_CLEANUP' });

const updateCheck = async () => {
  const now = new Date().toLocaleString('en-US');
  const res = await Axios.get(checkEndpoint);
  // tslint:disable-next-line:no-console
  console.log(now, checkType, 'from API:', res.data);
};

let initialUpdateCheckRun = false;
const updateCheckQueue: UpdateCheckTask[] = [];
const startPeriodicUpdateCheck = async () => {
  // Periodically check in interval
  setInterval(updateCheck, checkInterval);
  // Run the initial check
  await updateCheck();
  initialUpdateCheckRun = true;
  while (updateCheckQueue.length > 0) {
    updateCheckQueue.shift()();
  }
};

// tslint:disable:no-console
const registerWorkboxListeners = (wb: Workbox, presenter: AppPresenter) => {
  let updateInProgress = false;
  wb.addEventListener('activated', event => {
    if (event.isUpdate) {
      return;
    }
    handleNewVersion(
      presenter,
      'Service worker activated. Refresh to make sure the app works offline.',
    );
  });

  const updateWorker = () => {
    wb.addEventListener('controlling', () =>
      presenter.snackbar('Service worker updated'),
    );
    wb.messageSW({ type: 'SKIP_WAITING' });
  };

  wb.addEventListener('waiting', () => {
    if (reloadInProgress || updateInProgress) {
      return;
    }
    if (!initialUpdateCheckRun) {
      updateCheckQueue.push(updateWorker);
    } else {
      updateWorker();
    }
  });

  const channel = new BroadcastChannel('cache-updates');
  channel.addEventListener('message', async event => {
    const data = event.data as WorkboxMessage;
    if (data.type !== 'CACHE_UPDATED') {
      return;
    }
    updateInProgress = true;
    await triggerCacheCleanup(wb);
    await handleNewVersion(presenter);
    updateInProgress = false;
  });
};
// tslint:enable:no-console

const registerServiceWorker = (presenter: AppPresenter) => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    registerWorkboxListeners(wb, presenter);
    wb.register();
    startPeriodicUpdateCheck();

    (window as any).loadNewVersion = async () => {
      handleNewVersion(presenter, null, async () => {
        await triggerCacheCleanup(wb);
        window.location.reload();
      });
    };
  }
};

import('./app').then(
  ({ default: app }) => {
    const presenter = app(document.getElementById('app'), () => loadMap(presenter));
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
