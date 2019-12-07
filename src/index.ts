import { IS_PRODUCTION } from '@utils/Constants';
import 'core-js/stable';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import 'regenerator-runtime/runtime';
import './scss/main.scss';

if (IS_PRODUCTION) {
  OfflinePluginRuntime.install();
}

window.addEventListener('load', () => {
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
});
