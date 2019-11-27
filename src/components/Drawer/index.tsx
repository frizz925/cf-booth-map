import classNames from 'classnames';
import React, { PureComponent } from 'react';
import * as styles from './styles.scss';

export interface DrawerProps {
  opened: boolean;
  onClose: () => void;
}

export default class Drawer extends PureComponent<DrawerProps> {
  public render() {
    const { opened, onClose } = this.props;
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
          <h3 className={styles.title}>Comic Frontier Booth Map</h3>
          <ul className={styles.menuList}>
            <li className={styles.menuItem}>Map</li>
            <li className={styles.menuItem}>Bookmark</li>
            <li className={styles.menuSpacer}></li>
            <li className={styles.menuItem}>Fork me on GitHub!</li>
          </ul>
        </div>
      </div>
    );
  }
}
