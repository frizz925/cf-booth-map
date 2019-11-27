import Drawer from '@components/Drawer';
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
  public render() {
    const { drawerOpened } = this.props.store;
    return <Drawer opened={drawerOpened} onClose={this.onClose} />;
  }

  @action
  private onClose = () => {
    this.props.store.drawerOpened = false;
  };
}
