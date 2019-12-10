import Drawer, { DrawerItem } from '@components/Drawer';
import { faBookmark, faInfoCircle, faSync } from '@fortawesome/free-solid-svg-icons';
import DrawerPresenter from '@presenters/DrawerPresenter';
import React, { useCallback, useEffect, useState } from 'react';

const drawerItems: DrawerItem[] = [
  {
    icon: faBookmark,
    title: 'Bookmarks',
    path: '/bookmarks',
  },
  {
    icon: faInfoCircle,
    title: 'About',
    path: '/about',
  },
  {
    icon: faSync,
    title: 'Refresh',
    action: () => window.location.reload(),
  },
];

export default ({ presenter }: { presenter: DrawerPresenter }) => {
  const [opened, setOpened] = useState(presenter.opened.value);

  useEffect(() => {
    const subscriber = presenter.opened.subscribe(setOpened);
    return () => subscriber.unsubscribe();
  }, [presenter]);

  return (
    <Drawer
      opened={opened}
      onClose={useCallback(() => presenter.opened.next(false), [presenter])}
      topItems={drawerItems}
    />
  );
};
