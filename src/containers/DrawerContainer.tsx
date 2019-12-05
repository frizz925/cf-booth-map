import Drawer from '@components/Drawer';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBookmark, faCog } from '@fortawesome/free-solid-svg-icons';
import DrawerPresenter from '@presenters/DrawerPresenter';
import { GITHUB_LINK } from '@utils/Constants';
import React, { useEffect, useState } from 'react';

export default ({ presenter }: { presenter: DrawerPresenter }) => {
  const [opened, setOpened] = useState(presenter.opened.value);

  useEffect(() => {
    const subscriber = presenter.opened.subscribe(setOpened);
    return () => subscriber.unsubscribe();
  }, []);

  return (
    <Drawer
      opened={opened}
      onClose={() => presenter.opened.next(false)}
      topItems={[
        {
          icon: faBookmark,
          title: 'Bookmarks',
          path: '/bookmarks',
        },
        {
          // idk what the settings will be for,
          // but I guess it can be used for troubleshooting stuff
          icon: faCog,
          title: 'Settings',
          path: '/settings',
        },
      ]}
      bottomItems={[
        {
          icon: faGithub,
          title: 'Fork me on GitHub',
          href: GITHUB_LINK,
        },
      ]}
    />
  );
};
