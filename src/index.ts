import AppContext from '@models/AppContext';
import { observable } from 'mobx';
import './styles';

const context: AppContext = observable({
  mapDisabled: false,
});

import('./app').then(({ default: app }) => {
  app(context, document.getElementById('app'));
});
import('./map').then(({ default: map }) => {
  map(context, document.getElementById('stage'));
});
