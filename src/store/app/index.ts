import { isDevelopment } from '@utils/env';
import { createStore } from 'redux';
import reducers from './reducers';

const store = isDevelopment ? createStore(
  reducers,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
) : createStore(reducers);
export default store;
