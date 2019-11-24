import '@assets/modernizr-custom';
import AppContext from '@models/AppContext';
import { observable } from 'mobx';
import 'normalize.css';

const context: AppContext = observable({
  mapDisabled: false,
});

window.addEventListener('load', () => {
  import('./app').then(
    ({ default: app }) => {
      app(context, document.getElementById('app'));
    },
    err => console.error(err),
  );
  import('./map').then(
    ({ default: map }) => {
      map(context, document.getElementById('stage'));
    },
    err => console.error(err),
  );
});
