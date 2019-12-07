import AppContainer from '@containers/AppContainer';
import AppContext, { AppContextType } from '@contexts/AppContext';
import CircleParser from '@models/parsers/CircleParser';
import AppPresenter from '@presenters/AppPresenter';
import CardPresenter from '@presenters/CardPresenter';
import DrawerPresenter from '@presenters/DrawerPresenter';
import PagePresenter from '@presenters/PagePresenter';
import SearchPresenter from '@presenters/SearchPresenter';
import BookmarkRepositoryStorage from '@repositories/BookmarkRepositoryStorage';
import CircleRepositoryApi from '@repositories/CircleRepositoryApi';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import BookmarkObservable from './observables/BookmarkObservable';

const app = (el: Element) => {
  const { protocol, host } = window.location;
  const circleClient = axios.create({
    baseURL: `${protocol}//${host}/`,
  });
  const circleParser = new CircleParser('https://catalog.comifuro.net/');
  const circleRepository = new CircleRepositoryApi(circleClient, circleParser);
  const bookmarkRepository = new BookmarkRepositoryStorage();
  const bookmarkObservable: BookmarkObservable = bookmarkRepository;

  const context: AppContextType = {
    repositories: {
      circle: circleRepository,
      bookmark: bookmarkRepository,
    },
    observables: {
      bookmark: bookmarkObservable,
    },
  };

  const presenter = new AppPresenter(
    new PagePresenter(),
    new CardPresenter(bookmarkRepository, bookmarkObservable),
    new DrawerPresenter(),
    new SearchPresenter(circleRepository),
  );

  ReactDOM.render(
    <AppContext.Provider value={context}>
      <AppContainer presenter={presenter} />
    </AppContext.Provider>,
    el,
  );
};

window.addEventListener('load', () => {
  app(document.getElementById('app'));
});
