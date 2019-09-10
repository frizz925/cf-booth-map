import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { closeDrawer } from '@store/app/actions';
import { AppState } from '@store/app/types';
import { GITHUB_REPO_URL } from '@utils/const';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styles from './styles.css';

interface StateToProps {
  drawerShown: boolean;
}

interface DispatchToProps {
  closeDrawer: () => void;
}

type DrawerProps = StateToProps & DispatchToProps;

interface DrawerItem {
  icon: IconProp;
  caption: string;
  link?: string;
  onClick?: () => void;
}

const DrawerListItem: React.FC<DrawerItem> = (props) => (
  <a href={props.link || '#'} target='_blank' onClick={props.onClick}>
    <li className={styles.drawerListItem}>
      <span>
        <FontAwesomeIcon icon={props.icon} />
      </span>
      <span>{props.caption}</span>
    </li>
  </a>
);

const DrawerList: React.FC<{ items: DrawerItem[] }> = ({ items }) => (
  <ul className={styles.drawerList}>
    {items.map((item, idx) => <DrawerListItem key={idx} {...item} />)}
  </ul>
);

const drawerItems: DrawerItem[] = [{
  icon: faGithub,
  caption: 'Fork me on GitHub',
  link: GITHUB_REPO_URL,
}];

class Drawer extends PureComponent<DrawerProps> {
  public render() {
    const {drawerShown} = this.props;
    const shownClassName = {
      [styles.drawerShown]: drawerShown,
    };
    const containerClassName = classNames('drawer', styles.drawerContainer, shownClassName);
    const wrapperClassName = classNames('drawer', styles.drawerWrapper, shownClassName);
    return (
      <div className={containerClassName} onClick={this.props.closeDrawer}>
        <div className={wrapperClassName}>
          <h3 className={styles.drawerTitle}>{document.title}</h3>
          <DrawerList items={drawerItems} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState): StateToProps => ({
  drawerShown: state.drawerShown,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  closeDrawer() {
    dispatch(closeDrawer());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Drawer);
