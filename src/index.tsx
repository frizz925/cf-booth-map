// Styles
import('./styles');

import { isProduction } from '@utils/env';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';

if (isProduction && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('workbox-window').then(({ Workbox }) => {
      const wb = new Workbox('/sw.js');
      wb.register();
    });
  });
}

ReactDOM.render(<App />, document.getElementById('app'));
