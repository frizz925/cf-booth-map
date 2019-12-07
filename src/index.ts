import 'regenerator-runtime/runtime';
import WebFont from 'webfontloader';
import './scss/main.scss';

WebFont.load({
  google: {
    families: ['Roboto:300,400,500'],
  },
});

import('./app')
  .then(({ default: app }) => {
    app(document.getElementById('app'));
    return import('./map');
  })
  .then(({ default: map }) => {
    map(document.getElementById('stage'));
  })
  .catch(err => console.error(err));

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(
      // tslint:disable-next-line:no-console
      reg => console.log('SW Registration success: ', reg),
      err => console.error('SW Registration failed: ', err),
    );
  }
});
