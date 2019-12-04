import CardContainer from '@containers/CardContainer';
import DrawerContainer from '@containers/DrawerContainer';
import SearchContainer from '@containers/SearchContainer';
import AppPresenter from '@presenters/AppPresenter';
import { IS_DEVELOPMENT } from '@utils/Constants';
import React from 'react';
import { hot } from 'react-hot-loader/root';

const AppContainer = ({ presenter }: { presenter: AppPresenter }) => {
  const { cardPresenter, drawerPresenter, searchPresenter } = presenter;
  return (
    <div>
      <DrawerContainer presenter={drawerPresenter} />
      <SearchContainer presenter={searchPresenter} />
      <CardContainer presenter={cardPresenter} />
    </div>
  );
};

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
