import Loading from '@components/Loading';
import ManagedRouter from '@components/ManagedRouter';
import NullLoading from '@components/NullLoading';
import AppPresenter from '@presenters/AppPresenter';
import { IS_DEVELOPMENT } from '@utils/Constants';
import React, { lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader/root';

const DrawerContainer = lazy(() => import('@containers/DrawerContainer'));
const SearchContainer = lazy(() => import('@containers/SearchContainer'));
const CardContainer = lazy(() => import('@containers/CardContainer'));
const PageContainer = lazy(() => import('@containers/PageContainer'));

const AppContainer = ({ presenter }: { presenter: AppPresenter }) => {
  const { pagePresenter, cardPresenter, drawerPresenter, searchPresenter } = presenter;
  return (
    <ManagedRouter>
      <Suspense fallback={<Loading />}>
        <SearchContainer presenter={searchPresenter} />
      </Suspense>
      <Suspense fallback={<NullLoading />}>
        <CardContainer presenter={cardPresenter} />
      </Suspense>
      <Suspense fallback={<NullLoading />}>
        <DrawerContainer presenter={drawerPresenter} />
        <PageContainer presenter={pagePresenter} />
      </Suspense>
    </ManagedRouter>
  );
};

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
