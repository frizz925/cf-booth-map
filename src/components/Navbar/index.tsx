import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isIphoneXAppMode } from '@utils/Device';
import classNames from 'classnames';
import map from 'lodash/map';
import React, { Ref } from 'react';
import { Link } from 'react-router-dom';
import * as styles from './styles.scss';

export type OnSelected = (item: NavbarItem, index: number) => void;
type OnSelectedItem = (item: NavbarItem) => void;

export interface NavbarItem {
  icon: IconDefinition;
  iconActive?: IconDefinition;
  title: string;
  path?: string;
  href?: string;
  action?: () => void;
}

export interface NavbarProps {
  id?: string;
  containerRef?: Ref<HTMLDivElement>;

  shown: boolean;
  selectedIndex: number;
  items: NavbarItem[];

  onSelected: OnSelected;
}

const getLinkTarget = (link: string) => {
  return link.indexOf('://') > 0 ? '_blank' : '';
};

const NavbarLink: React.FC<{
  item: NavbarItem;
  selected: boolean;
  onSelectedItem: OnSelectedItem;
}> = ({ children, item, selected, onSelectedItem }) => {
  const { href, path, action } = item;
  const menuItemClassNames = classNames(styles.menuItem, {
    [styles.selected]: selected,
  });
  const renderHref = () => (
    <a className={menuItemClassNames} href={href} target={getLinkTarget(href)}>
      {children}
    </a>
  );
  const renderAction = () => (
    <div className={menuItemClassNames} onClick={action}>
      {children}
    </div>
  );
  const renderLink = () => (
    <Link className={menuItemClassNames} to={path} onClick={() => onSelectedItem(item)}>
      {children}
    </Link>
  );
  return href ? renderHref() : action ? renderAction() : renderLink();
};

const renderItem = (
  index: number,
  item: NavbarItem,
  selected: boolean,
  onSelectedItem: OnSelectedItem,
) => (
  <NavbarLink key={index} item={item} selected={selected} onSelectedItem={onSelectedItem}>
    <div className={styles.menuIcon}>
      <FontAwesomeIcon icon={(selected && item.iconActive) || item.icon} />
    </div>
    <div className={styles.menuTitle}>{item.title}</div>
  </NavbarLink>
);

const Navbar: React.FC<NavbarProps> = ({
  id,
  containerRef,
  shown,
  selectedIndex,
  items,
  onSelected,
}) => {
  const containerClassNames = classNames(styles.container, {
    [styles.shown]: shown,
    [styles.iphonex]: isIphoneXAppMode,
  });
  const bottomPadClassNames = classNames(styles.bottomPad, {
    [styles.iphonex]: isIphoneXAppMode,
  });
  return (
    <div id={id} ref={containerRef} className={containerClassNames}>
      <div className={styles.menu}>
        {map(items, (item, idx) =>
          renderItem(idx, item, idx === selectedIndex, () => onSelected(item, idx)),
        )}
      </div>
      <div className={bottomPadClassNames}></div>
    </div>
  );
};

export default Navbar;
