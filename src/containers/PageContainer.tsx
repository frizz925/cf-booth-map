import PageScreen from '@components/PageScreen';
import AppContext from '@contexts/AppContext';
import NavbarPresenter from '@presenters/NavbarPresenter';
import PagePresenter from '@presenters/PagePresenter';
import BookmarksPresenter from '@presenters/pages/BookmarksPresenter';
import map from 'lodash/map';
import React, { lazy, Suspense, useContext, useEffect, useMemo, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router';

const BookmarksPage = lazy(() => import('@pages/BookmarksPage'));
const AboutPage = lazy(() => import('@pages/AboutPage'));

interface PageDefinitions {
  [key: string]: {
    title: string;
    page: React.ReactNode;
  };
}

const Loading = () => <div>Loading...</div>;

export default ({
  presenter,
  navbarPresenter,
}: {
  presenter: PagePresenter;
  navbarPresenter: NavbarPresenter;
}) => {
  const { repositories, observables } = useContext(AppContext);
  const [navbar, setNavbar] = useState<Element>();

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

  useEffect(() => {
    const subscriber = navbarPresenter.navbarElement.subscribe(setNavbar);
    return () => subscriber.unsubscribe();
  }, []);

  useEffect(() => {
    presenter.opened.next(opened);
  }, [presenter, opened]);

  useEffect(() => {
    presenter.path.next(path);
  }, [presenter, path]);

  return (
    <PageScreen opened={opened} title={title} navbar={navbar}>
      <Suspense fallback={<Loading />}>
        <Switch>
          {map(pageDefinitions, (def, key) => (
            <Route key={key} path={key}>
              {def.page}
            </Route>
          ))}
        </Switch>
      </Suspense>
    </PageScreen>
  );
};
