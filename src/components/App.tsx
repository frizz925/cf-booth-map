import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { isDevelopment } from '../utils/env';

const MainPage = React.lazy(() => import('../pages/Main'));
const Loading = <div>Loading...</div>;
const App: React.FC = () => (
  <React.Suspense fallback={Loading}>
    <MainPage />
  </React.Suspense>
);

export default isDevelopment ? hot(App) : App;
