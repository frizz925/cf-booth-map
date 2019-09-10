import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { closeDrawer } from '@store/app/actions';
import { AppState } from '@store/app/types';
import { GITHUB_REPO_URL } from '@utils/const';
import { isDevelopment } from '@utils/env';
import reactiveState from '@utils/reactiveState';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styles from './styles.css';

const DRAWER_CLOSING_THRESHOLD = 0.5;

interface StateToProps {
  drawerShown: boolean;
}

interface DispatchToProps {
  closeDrawer: () => void;
}

type DrawerProps = StateToProps & DispatchToProps;

interface DrawerState {
  left?: number;
  isDragged?: boolean;
}

interface DrawerItem {
  icon: IconProp;
  caption: string;
  link?: string;
  onClick?: () => void;
}

const DrawerListItem: React.FC<DrawerItem> = (props) => {
  return (
    <a
      className={styles.drawerListItem}
      href={props.link || '#'}
      target={props.link ? '_blank' : null}
      rel='noopener'
      onClick={props.onClick}
    >
      <span>
        <FontAwesomeIcon icon={props.icon} />
      </span>
      <span>{props.caption}</span>
    </a>
  );
};

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

class Drawer extends PureComponent<DrawerProps, DrawerState> {
  private reactiveState = reactiveState(this);
  private wrapperRef = React.createRef<HTMLDivElement>();
  private mc: HammerManager;

  private startLeft: number;
  private drawerWidth: number;

  constructor(props: DrawerProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    this.drawerWidth = this.wrapperRef.current
      .getBoundingClientRect()
      .width;
    this.mc = this.setupHammer();
  }

  public componentWillUnmount() {
    this.mc.destroy();
  }

  public componentDidUpdate(prevProps: DrawerProps) {
    // Handle opening up drawer
    if (!prevProps.drawerShown && this.props.drawerShown) {
      this.reactiveState.left = null;
    }
  }

  public render() {
    const {drawerShown} = this.props;
    const {left, isDragged} = this.state;

    const shownClassName = {
      [styles.drawerShown]: drawerShown,
    };
    const containerClassName = classNames('drawer', styles.drawerContainer, shownClassName);
    const wrapperClassName = classNames('drawer', styles.drawerWrapper, shownClassName);

    const wrapperStyle = isDragged && left ? {
      left,
      transition: 'left 0s',
    } : null;
    return (
      <div className={containerClassName} onClick={this.props.closeDrawer}>
        <div ref={this.wrapperRef} className={wrapperClassName} style={wrapperStyle}>
          <h3 className={styles.drawerTitle}>{document.title}</h3>
          <DrawerList items={drawerItems} />
        </div>
      </div>
    );
  }

  private setupHammer(): HammerManager {
    const mc = new Hammer.Manager(this.wrapperRef.current);
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.on('panstart panmove', (evt) => {
      if (evt.type === 'panstart') {
        this.startLeft = this.state.left || 0;
        this.reactiveState.isDragged = true;
      }
      const left = this.startLeft + evt.deltaX;
      this.reactiveState.left = Math.min(left, 0);
    });
    mc.on('panend', (evt) => {
      let shouldClose = false;
      if (evt.velocityX * -1 >= DRAWER_CLOSING_THRESHOLD) {
        shouldClose = true;
        this.props.closeDrawer();
      } else {
        const { left } = this.state;
        const percentage = (this.drawerWidth + left) / this.drawerWidth;
        shouldClose = percentage <= DRAWER_CLOSING_THRESHOLD;
      }

      this.setState({
        left: null,
        isDragged: false,
      });
      if (shouldClose) {
        this.props.closeDrawer();
      }
    });
    return mc;
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
