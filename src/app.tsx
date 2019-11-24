import Loading from '@components/Loading';
import AppContext from '@models/AppContext';
import CircleRepository from '@repositories/CircleRepository';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

const AppContainer = React.lazy(() => import('@containers/AppContainer'));
const App = (context: AppContext, el: Element) => {
  const props = {
    context,
    circleRepository: new CircleRepository(),
  };

  ReactDOM.render(
    <Suspense fallback={<Loading />}>
      <AppContainer {...props} />
    </Suspense>,
    el,
  );
};

export default App;
