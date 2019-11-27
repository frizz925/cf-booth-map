import Drawer, { DrawerItem } from '@components/Drawer';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBookmark, faCog, faMap } from '@fortawesome/free-solid-svg-icons';
import { GITHUB_LINK } from '@utils/Constants';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';

export interface DrawerContainerStore {
  drawerOpened: boolean;
}

export interface DrawerContainerProps {
  store: DrawerContainerStore;
}

@observer
export default class DrawerContainer extends PureComponent<DrawerContainerProps> {
  private topItems: DrawerItem[] = [
    {
      icon: faMap,
      title: 'Map',
      href: '#',
    },
    {
      icon: faBookmark,
      title: 'Bookmarks',
      href: '#',
    },
    {
      // idk what the settings will be for,
      // but I guess it can be used for troubleshooting stuff
      icon: faCog,
      title: 'Settings',
      href: '#',
    },
  ];

  private bottomItems: DrawerItem[] = [
    {
      icon: faGithub,
      title: 'Fork me on GitHub',
      href: GITHUB_LINK,
    },
  ];

  public render() {
    const { drawerOpened } = this.props.store;
    return (
      <Drawer
        opened={drawerOpened}
        onClose={this.onClose}
        topItems={this.topItems}
        bottomItems={this.bottomItems}
      />
    );
  }

  @action
  private onClose = () => {
    this.props.store.drawerOpened = false;
  };
}
