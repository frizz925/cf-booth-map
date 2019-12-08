import Loading from '@components/Loading';
import ManagedRouter from '@components/ManagedRouter';
import NullLoading from '@components/NullLoading';
import AppPresenter from '@presenters/AppPresenter';
import { IS_DEVELOPMENT } from '@utils/Constants';
import map from 'lodash/map';
import React, { lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader/root';

const SearchContainer = lazy(() => import('@containers/SearchContainer'));
const CardContainer = lazy(() => import('@containers/CardContainer'));
const DrawerContainer = lazy(() => import('@containers/DrawerContainer'));
const PageContainer = lazy(() => import('@containers/PageContainer'));

const AppContainer = ({ presenter }: { presenter: AppPresenter }) => {
  const { pagePresenter, cardPresenter, drawerPresenter, searchPresenter } = presenter;
  const containers = [
    <PageContainer presenter={pagePresenter} />,
    <CardContainer presenter={cardPresenter} />,
    <DrawerContainer presenter={drawerPresenter} />,
  ];
  return (
    <ManagedRouter>
      <Suspense fallback={<Loading />}>
        <SearchContainer presenter={searchPresenter} />
      </Suspense>
      {map(containers, (container, idx) => (
        <Suspense key={idx} fallback={<NullLoading />}>
          {container}
        </Suspense>
      ))}
    </ManagedRouter>
  );
};

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
