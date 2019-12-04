import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_VERSION } from '@utils/Constants';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import map from 'lodash/map';
import React, { useEffect, useRef, useState } from 'react';
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

const getLinkTarget = (link: string) => {
  return link.indexOf('://') > 0 ? '_blank' : '';
};

const renderItems = (items?: DrawerItem[]) => {
  return map(items || [], item => (
    <a
      key={item.href}
      href={item.href}
      className={styles.menuItem}
      target={getLinkTarget(item.href)}
    >
      <span className={styles.menuItemIcon}>
        <FontAwesomeIcon icon={item.icon} />
      </span>
      <span className={styles.menuItemTitle}>{item.title}</span>
    </a>
  ));
};

export default (props: DrawerProps) => {
  const { opened, topItems, bottomItems, onClose } = props;

  const [pulling, setPulling] = useState(false);
  const overlayRef = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();
  const startX = useRef(0);

  const handlePan = (evt: HammerInput) => {
    const overlay = overlayRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    if (evt.type === 'panstart') {
      startX.current = rect.left;
      setPulling(true);
    } else if (evt.type === 'panend') {
      if (-rect.left >= rect.width / 2) {
        onClose();
      }
      container.style.removeProperty('left');
      overlay.style.removeProperty('opacity');
      setPulling(false);
      return;
    }
    const left = Math.max(-rect.width, Math.min(startX.current + evt.deltaX, 0));
    container.style.setProperty('left', `${left}px`);
    const opacity = 1.0 - Math.min(Math.max(0, -left / rect.width), 1.0);
    overlay.style.setProperty('opacity', '' + opacity);
  };

  useEffect(() => {
    const mc = new Hammer.Manager(containerRef.current);
    mc.add(new Hammer.Swipe());
    mc.add(new Hammer.Pan({ pointers: 0, threshold: 0 })).recognizeWith(mc.get('swipe'));
    mc.on('panstart panmove panend', handlePan);
    return () => {
      mc.destroy();
    };
  }, []);

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
      <div ref={overlayRef} className={overlayClassNames} onClick={onClose} />
      <div ref={containerRef} className={containerClassNames}>
        <div className={styles.header}>
          <h3 className={styles.title}>Comic Frontier Booth Map</h3>
          <div className={styles.version}>{APP_VERSION}</div>
        </div>
        <div className={styles.menuList}>
          {renderItems(topItems)}
          <div className={styles.menuSpacer} />
          {renderItems(bottomItems)}
        </div>
      </div>
    </div>
  );
};
