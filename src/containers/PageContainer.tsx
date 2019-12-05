import PageScreen from '@components/PageScreen';
import PagePresenter from '@presenters/PagePresenter';
import React, { lazy, Suspense, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

const BookmarksPage = lazy(() => import('@pages/BookmarksPage'));
const SettingsPage = lazy(() => import('@pages/SettingsPage'));

interface PageDefinitions {
  [key: string]: {
    title: string;
    page: React.ExoticComponent;
  };
}

const pageDefinitions: PageDefinitions = {
  '/bookmarks': {
    title: 'Bookmarks',
    page: BookmarksPage,
  },
  '/settings': {
    title: 'Settings',
    page: SettingsPage,
  },
};

const Loading = () => <div>Loading...</div>;

export default ({ presenter }: { presenter: PagePresenter }) => {
  const history = useHistory();
  const location = useLocation();

  const path = location.pathname;
  const pageDefinition = pageDefinitions[path];

  const opened = !!pageDefinition;
  const title = pageDefinition ? pageDefinition.title : '';
  const Page = pageDefinition ? pageDefinition.page : null;

  useEffect(() => {
    presenter.opened.next(opened);
  }, [opened]);

  return (
    <PageScreen opened={opened} title={title} onBack={() => history.push('/')}>
      <Suspense fallback={<Loading />}>{Page ? <Page /> : null}</Suspense>
    </PageScreen>
  );
};
