import 'normalize.css';
import './scss/main.scss';

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
