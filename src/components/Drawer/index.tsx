import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_VERSION } from '@utils/Constants';
import classNames from 'classnames';
import Hammer from 'hammerjs';
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

interface DrawerState {
  pulling: boolean;
}

export default class Drawer extends PureComponent<DrawerProps, DrawerState> {
  public state = {
    pulling: false,
  };

  private overlayRef = React.createRef<HTMLDivElement>();
  private containerRef = React.createRef<HTMLDivElement>();
  private panState = {
    startX: 0,
  };

  private mc: HammerManager;

  public componentDidMount() {
    this.mc = this.registerHammer();
  }

  public componentWillUnmount() {
    if (this.mc) {
      this.mc.destroy();
      this.mc = null;
    }
  }

  public render() {
    const { props, state } = this;
    const { pulling } = state;
    const { opened, topItems, bottomItems, onClose } = props;
    const overlayClassNames = classNames('overlay-generic', styles.overlay, {
      'overlay-visible': opened,
      [styles.opened]: opened,
      [styles.pulling]: pulling,
    });
    const containerClassNames = classNames(styles.container, {
      [styles.opened]: opened,
      [styles.pulling]: pulling,
    });
    return (
      <div>
        <div ref={this.overlayRef} className={overlayClassNames} onClick={onClose} />
        <div ref={this.containerRef} className={containerClassNames}>
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

  private registerHammer(): HammerManager {
    const mc = new Hammer.Manager(this.containerRef.current);
    mc.add(new Hammer.Swipe());
    mc.add(new Hammer.Pan({ pointers: 0, threshold: 0 })).recognizeWith(mc.get('swipe'));
    mc.on('panstart panmove panend', this.handlePan);
    return mc;
  }

  private handlePan = (evt: HammerInput) => {
    const { props, overlayRef, containerRef, panState } = this;
    const overlay = overlayRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    if (evt.type === 'panstart') {
      panState.startX = rect.left;
      this.setState({ pulling: true });
    } else if (evt.type === 'panend') {
      if (-rect.left >= rect.width / 2) {
        props.onClose();
      }
      container.style.removeProperty('left');
      overlay.style.removeProperty('opacity');
      this.setState({ pulling: false });
      return;
    }
    const left = Math.max(-rect.width, Math.min(panState.startX + evt.deltaX, 0));
    container.style.setProperty('left', `${left}px`);
    const opacity = 1.0 - Math.min(Math.max(0, -left / rect.width), 1.0);
    overlay.style.setProperty('opacity', '' + opacity);
  };

  private renderItems(items?: DrawerItem[]) {
    return map(items || [], (item, idx) => (
      <a
        key={idx}
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
