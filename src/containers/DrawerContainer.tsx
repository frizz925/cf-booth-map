import Drawer from '@components/Drawer';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBookmark, faCog, faMap } from '@fortawesome/free-solid-svg-icons';
import DrawerPresenter from '@presenters/DrawerPresenter';
import { GITHUB_LINK } from '@utils/Constants';
import React, { useEffect, useState } from 'react';

export default ({ presenter }: { presenter: DrawerPresenter }) => {
  const [opened, setOpened] = useState(presenter.opened.value);

  useEffect(() => {
    const subscriber = presenter.opened.subscribe(setOpened);
    return () => subscriber.unsubscribe();
  });

  return (
    <Drawer
      opened={opened}
      onClose={() => presenter.opened.next(false)}
      topItems={[
        {
          icon: faMap,
          title: 'Map',
          href: '#',
        },
        {
          icon: faBookmark,
          title: 'Bookmarks',
          href: '#/bookmarks',
        },
        {
          // idk what the settings will be for,
          // but I guess it can be used for troubleshooting stuff
          icon: faCog,
          title: 'Settings',
          href: '#/settings',
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
