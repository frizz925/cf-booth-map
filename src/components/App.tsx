import store from '@store/app';
import { isDevelopment } from '@utils/env';
import React, { ComponentType, Suspense } from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';
import Loading from './Loading';

const lazyComponent = (loader: () => Promise<{ default: ComponentType<any> }>): React.FC<any> => {
  const LazyComponent = React.lazy(loader);
  return (props) => (
    <Suspense fallback={<Loading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
const MainPage = lazyComponent(() => import('@pages/Main'));
const MappingPage = lazyComponent(() => import('@pages/Mapping'));
const PreviewPage = lazyComponent(() => import('@pages/Preview'));

const App: React.FC = () => isDevelopment ? (
  <Router>
    <Route path='/' exact={true} component={MainPage} />
    <Route path='/mapping' component={MappingPage} />
    <Route path='/preview/:id' component={PreviewPage} />
    <Route path='/loading' component={Loading} />
  </Router>
) : <MainPage />;

const ConnectedApp: React.FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default isDevelopment ? hot(ConnectedApp) : ConnectedApp;
