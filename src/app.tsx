import Loading from '@components/Loading';
import { AppContainerProps, AppStore } from '@containers/AppContainer';
import CircleParser from '@models/parsers/CircleParser';
import CircleRepositoryApi from '@repositories/CircleRepositoryApi';
import axios from 'axios';
import { observable } from 'mobx';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

const AppContainer = React.lazy(() => import('@containers/AppContainer'));
const App = (el: Element) => {
  const { protocol, host } = window.location;
  const circleClient = axios.create({
    baseURL: `${protocol}//${host}/`,
  });
  const circleParser = new CircleParser('https://catalog.comifuro.net/');
  const circleRepository = new CircleRepositoryApi(circleClient, circleParser);
  const store: AppStore = {
    drawerShown: false,
    cardShown: false,
    cardPulled: false,
    focused: false,
    searching: false,
    searchText: '',
    selectedCircle: null,
  };

  const props: AppContainerProps = {
    circleRepository,
    store: observable(store),
  };

  ReactDOM.render(
    <Suspense fallback={<Loading />}>
      <AppContainer {...props} />
    </Suspense>,
    el,
  );
};

export default App;
