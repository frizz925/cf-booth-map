import AppContainer from '@containers/AppContainer';
import AppContext, { AppContextType } from '@contexts/AppContext';
import CircleParser from '@models/parsers/CircleParser';
import AppPresenter from '@presenters/AppPresenter';
import CardPresenter from '@presenters/CardPresenter';
import DrawerPresenter from '@presenters/DrawerPresenter';
import PagePresenter from '@presenters/PagePresenter';
import SearchPresenter from '@presenters/SearchPresenter';
import SnackbarPresenter from '@presenters/SnackbarPresenter';
import BookmarkRepositoryStorage from '@repositories/BookmarkRepositoryStorage';
import CircleRepositoryApi from '@repositories/CircleRepositoryApi';
import axios from 'axios';
import React from 'react';
import { render } from 'react-dom';
import BookmarkObservable from './observables/BookmarkObservable';

const app = (root: Element) => {
  const { protocol, host } = window.location;
  const circleClient = axios.create({
    baseURL: `${protocol}//${host}/`,
  });
  const circleParser = new CircleParser('https://catalog.comifuro.net/');
  const circleRepository = new CircleRepositoryApi(circleClient, circleParser);
  const bookmarkRepository = new BookmarkRepositoryStorage();
  const bookmarkObservable: BookmarkObservable = bookmarkRepository;

  const presenter = new AppPresenter(
    bookmarkObservable,
    new PagePresenter(),
    new CardPresenter(bookmarkRepository, bookmarkObservable),
    new DrawerPresenter(),
    new SearchPresenter(circleRepository, bookmarkRepository, bookmarkObservable),
    new SnackbarPresenter(),
  );

  const context: AppContextType = {
    presenter,
    repositories: {
      circle: circleRepository,
      bookmark: bookmarkRepository,
    },
    observables: {
      bookmark: bookmarkObservable,
    },
  };

  render(
    <AppContext.Provider value={context}>
      <AppContainer presenter={presenter} />
    </AppContext.Provider>,
    root,
  );

  return presenter;
};

export default app;
