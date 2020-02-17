import ErrorBoundary from '@components/ErrorBoundary';
import Loading from '@components/Loading';
import ManagedRouter from '@components/ManagedRouter';
import NullLoading from '@components/NullLoading';
import AppPresenter from '@presenters/AppPresenter';
import { IS_DEVELOPMENT } from '@utils/Constants';
import map from 'lodash/map';
import React, { lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader/root';
import SnackbarContainer from './SnackbarContainer';

const SearchContainer = lazy(() => import('@containers/SearchContainer'));
const CardContainer = lazy(() => import('@containers/CardContainer'));
const NavbarContainer = lazy(() => import('@containers/NavbarContainer'));
const PageContainer = lazy(() => import('@containers/PageContainer'));

const AppContainer = ({ presenter }: { presenter: AppPresenter }) => {
  const {
    pagePresenter,
    cardPresenter,
    navbarPresenter,
    searchPresenter,
    snackbarPresenter,
  } = presenter;

  const reloadOnError = async () => {
    const message =
      'An error was encountered and the app needs to refresh. Press OK to refresh.';
    if (await presenter.confirm(message)) {
      window.location.reload();
    }
  };

  const containers = [
    <PageContainer presenter={pagePresenter} />,
    <CardContainer presenter={cardPresenter} />,
    <NavbarContainer presenter={navbarPresenter} />,
  ];

  return (
    <ManagedRouter>
      <ErrorBoundary onError={reloadOnError}>
        <Suspense fallback={<Loading />}>
          <SearchContainer presenter={searchPresenter} />
        </Suspense>
        {map(containers, (container, idx) => (
          <Suspense key={idx} fallback={<NullLoading />}>
            {container}
          </Suspense>
        ))}
      </ErrorBoundary>
      <SnackbarContainer presenter={snackbarPresenter} />
    </ManagedRouter>
  );
};

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
