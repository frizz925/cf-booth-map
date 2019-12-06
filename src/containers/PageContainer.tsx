import PageScreen from '@components/PageScreen';
import AppContext from '@contexts/AppContext';
import PagePresenter from '@presenters/PagePresenter';
import BookmarksPresenter from '@presenters/pages/BookmarksPresenter';
import React, { lazy, Suspense, useContext, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';

const BookmarksPage = lazy(() => import('@pages/BookmarksPage'));
const AboutPage = lazy(() => import('@pages/AboutPage'));

interface PageDefinitions {
  [key: string]: {
    title: string;
    page: React.ReactNode;
  };
}

const Loading = () => <div>Loading...</div>;

export default ({ presenter }: { presenter: PagePresenter }) => {
  const history = useHistory();
  const { repositories, observables } = useContext(AppContext);

  const pageDefinitions: PageDefinitions = useMemo(() => {
    const bookmarksPresenter = new BookmarksPresenter(
      repositories.bookmark,
      observables.bookmark,
    );
    bookmarksPresenter.circle.subscribe(presenter.circle);

    return {
      '/bookmarks': {
        title: 'Bookmarks',
        page: <BookmarksPage presenter={bookmarksPresenter} />,
      },
      '/about': {
        title: 'About',
        page: <AboutPage />,
      },
    };
  }, [repositories.bookmark]);

  const path = useLocation().pathname;
  const pageDefinition = pageDefinitions[path];

  const opened = !!pageDefinition;
  const title = pageDefinition ? pageDefinition.title : '';
  const page = pageDefinition ? pageDefinition.page : null;

  useEffect(() => {
    presenter.opened.next(opened);
  }, [opened]);

  useEffect(() => {
    presenter.path.next(path);
  }, [path]);

  return (
    <PageScreen opened={opened} title={title} onBack={() => history.push('/')}>
      <Suspense fallback={<Loading />}>{page}</Suspense>
    </PageScreen>
  );
};
