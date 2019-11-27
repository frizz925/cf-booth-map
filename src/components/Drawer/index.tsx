import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_VERSION } from '@utils/Constants';
import classNames from 'classnames';
import map from 'lodash/map';
import React, { PureComponent } from 'react';
import * as styles from './styles.scss';

export interface DrawerItem {
  icon: IconDefinition;
  title: string;
  href: string;
}

export interface DrawerProps {
  opened: boolean;
  topItems?: DrawerItem[];
  bottomItems?: DrawerItem[];
  onClose: () => void;
}

export default class Drawer extends PureComponent<DrawerProps> {
  public render() {
    const { opened, topItems, bottomItems, onClose } = this.props;
    const overlayClassNames = classNames('overlay-generic', styles.overlay, {
      'overlay-visible': opened,
      [styles.opened]: opened,
    });
    const containerClassNames = classNames(styles.container, {
      [styles.opened]: opened,
    });
    return (
      <div>
        <div className={overlayClassNames} onClick={onClose} />
        <div className={containerClassNames}>
          <div className={styles.header}>
            <h3 className={styles.title}>Comic Frontier Booth Map</h3>
            <div className={styles.version}>{APP_VERSION}</div>
          </div>
          <div className={styles.menuList}>
            {this.renderItems(topItems)}
            <div className={styles.menuSpacer} />
            {this.renderItems(bottomItems)}
          </div>
        </div>
      </div>
    );
  }

  private renderItems(items?: DrawerItem[]) {
    return map(items || [], item => (
      <a
        href={item.href}
        className={styles.menuItem}
        target={this.getLinkTarget(item.href)}
      >
        <span className={styles.menuItemIcon}>
          <FontAwesomeIcon icon={item.icon} />
        </span>
        <span className={styles.menuItemTitle}>{item.title}</span>
      </a>
    ));
  }

  private getLinkTarget(link: string): string {
    return link.indexOf('://') > 0 ? '_blank' : '';
  }
}
