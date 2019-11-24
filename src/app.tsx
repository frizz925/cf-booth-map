import Loading from '@components/Loading';
import AppContext from '@models/AppContext';
import CircleParser from '@models/parsers/CircleParser';
import CircleRepositoryApi from '@repositories/CircleRepositoryApi';
import axios from 'axios';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

const AppContainer = React.lazy(() => import('@containers/AppContainer'));
const App = (context: AppContext, el: Element) => {
  const { protocol, host } = window.location;
  const circleClient = axios.create({
    baseURL: `${protocol}//${host}/`,
  });
  const circleParser = new CircleParser('https://catalog.comifuro.net/');
  const circleRepository = new CircleRepositoryApi(circleClient, circleParser);

  const props = {
    context,
    circleRepository,
  };

  ReactDOM.render(
    <Suspense fallback={<Loading />}>
      <AppContainer {...props} />
    </Suspense>,
    el,
  );
};

export default App;
