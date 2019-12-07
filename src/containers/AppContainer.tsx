import ManagedRouter from '@components/ManagedRouter';
import CardContainer from '@containers/CardContainer';
import DrawerContainer from '@containers/DrawerContainer';
import SearchContainer from '@containers/SearchContainer';
import AppPresenter from '@presenters/AppPresenter';
import { IS_DEVELOPMENT } from '@utils/Constants';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import PageContainer from './PageContainer';

const AppContainer = ({ presenter }: { presenter: AppPresenter }) => {
  const { pagePresenter, cardPresenter, drawerPresenter, searchPresenter } = presenter;
  return (
    <ManagedRouter>
      <DrawerContainer presenter={drawerPresenter} />
      <SearchContainer presenter={searchPresenter} />
      <CardContainer presenter={cardPresenter} />
      <PageContainer presenter={pagePresenter} />
    </ManagedRouter>
  );
};

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
