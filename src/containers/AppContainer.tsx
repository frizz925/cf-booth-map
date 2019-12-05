import CardContainer from '@containers/CardContainer';
import DrawerContainer from '@containers/DrawerContainer';
import SearchContainer from '@containers/SearchContainer';
import AppPresenter from '@presenters/AppPresenter';
import { IS_DEVELOPMENT } from '@utils/Constants';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router } from 'react-router-dom';

const AppContainer = ({ presenter }: { presenter: AppPresenter }) => {
  const { cardPresenter, drawerPresenter, searchPresenter } = presenter;
  return (
    <Router>
      <DrawerContainer presenter={drawerPresenter} />
      <SearchContainer presenter={searchPresenter} />
      <CardContainer presenter={cardPresenter} />
    </Router>
  );
};

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
