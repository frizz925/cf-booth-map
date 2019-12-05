import Loading from '@components/Loading';
import CircleParser from '@models/parsers/CircleParser';
import AppPresenter from '@presenters/AppPresenter';
import CardPresenter from '@presenters/CardPresenter';
import DrawerPresenter from '@presenters/DrawerPresenter';
import PagePresenter from '@presenters/PagePresenter';
import SearchPresenter from '@presenters/SearchPresenter';
import CircleRepositoryApi from '@repositories/CircleRepositoryApi';
import axios from 'axios';
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
  const presenter = new AppPresenter(
    new PagePresenter(),
    new CardPresenter(),
    new DrawerPresenter(),
    new SearchPresenter(circleRepository),
  );

  ReactDOM.render(
    <Suspense fallback={<Loading />}>
      <AppContainer presenter={presenter} />
    </Suspense>,
    el,
  );
};

export default App;
