import LazyImage from '@components/LazyImage';
import {
  faFacebookSquare,
  faInstagram,
  faTwitterSquare,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import { SocialType } from '@models/Social';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import map from 'lodash/map';
import { action } from 'mobx';
import React, { PureComponent } from 'react';
import * as styles from './styles.scss';

const PULL_DELTA_THRESHOLD = 80;
const PULL_VELOCITY_THRESHOLD = 0.5;
const SHOWN_HEIGHT_THRESHOLD = 35;

export interface CircleCardProps {
  circle?: Circle;
  shown: boolean;
  pulled: boolean;

  onOverlayClick: () => void;
  onCardPulled: () => void;
  onCardHidden: () => void;
  onCardTabbed: () => void;
}

interface CircleCardState {
  pulling: boolean;
}

interface InfoMapping {
  title: string;
  render: (circle: Circle) => string | string[] | JSX.Element | JSX.Element[];
}

const defaultSocialIcon = faGlobe;
const socialIcons = {
  [SocialType.Facebook]: faFacebookSquare,
  [SocialType.Twitter]: faTwitterSquare,
  [SocialType.Instagram]: faInstagram,
  [SocialType.Web]: defaultSocialIcon,
};

const infoMapping: InfoMapping[] = [
  {
    title: 'Day(s)',
    render: ({ day }) => day,
  },
  {
    title: 'Fandoms',
    render: ({ fandoms }) => fandoms,
  },
  {
    title: 'Categories',
    render: ({ categories }) => categories,
  },
  {
    title: 'Rating',
    render: ({ rating }) => rating,
  },
  {
    title: 'Social',
    render: ({ socials }) =>
      socials.length > 0 ? (
        <div className={styles.socialList}>
          {socials.map(({ type, url }, idx) => (
            <a href={url} key={idx} className={styles.socialLink} target='_blank'>
              <FontAwesomeIcon icon={socialIcons[type] || defaultSocialIcon} />
            </a>
          ))}
        </div>
      ) : null,
  },
];

export default class CircleCard extends PureComponent<CircleCardProps, CircleCardState> {
  public state = {
    pulling: false,
  };

  private overlayRef = React.createRef<HTMLDivElement>();
  private containerRef = React.createRef<HTMLDivElement>();
  private headerRef = React.createRef<HTMLDivElement>();

  private panState = {
    startBottom: 0,
    currentBottom: 0,
    wasPulled: false,
  };

  private mc: HammerManager;

  public componentDidMount() {
    this.updateCard();
    this.registerListener();
    window.addEventListener('resize', this.onWindowResize);
  }

  public componentDidUpdate() {
    this.updateCard();
    this.registerListener();
  }

  public componentWillUnmount() {
    this.mc.destroy();
    window.removeEventListener('resize', this.onWindowResize);
  }

  public updateCard() {
    const { props, panState } = this;
    const { shown, pulled } = props;
    panState.wasPulled = props.pulled;
    const container = this.containerRef.current;
    if (!container) {
      return;
    }
    let bottom = 0;
    if (!shown) {
      bottom = -container.clientHeight;
    } else if (shown && !pulled) {
      bottom = -(container.clientHeight - this.headerRef.current.clientHeight);
    }
    this.updateContainerPosition(bottom);
  }

  public render() {
    const { shown, pulled, circle, onOverlayClick } = this.props;
    const { pulling } = this.state;
    const classModifiers = {
      [styles.shown]: shown,
      [styles.pulled]: pulled,
      [styles.pulling]: pulling,
    };
    const overlayClassNames = classNames(styles.overlay, classModifiers);
    const containerClassNames = classNames(styles.container, classModifiers);
    return (
      <div>
        <div
          ref={this.overlayRef}
          className={overlayClassNames}
          onClick={onOverlayClick}
        />
        <div ref={this.containerRef} className={containerClassNames}>
          <div ref={this.headerRef} className={styles.header}>
            <div className={styles.puller}>
              <span />
            </div>
            <div className={styles.title}>{circle ? circle.name : ''}</div>
            <div className={styles.number}>{circle ? circle.boothNumber : ''}</div>
          </div>
          {circle ? this.renderCardBody(circle) : null}
        </div>
      </div>
    );
  }

  public renderCardBody(circle: Circle) {
    return (
      <div className={styles.body}>
        <div className={styles.image}>
          <LazyImage src={circle.imageUrl} alt={circle.name} width={160} height={240} />
        </div>
        <div className={styles.details}>{this.renderInfo(circle)}</div>
      </div>
    );
  }

  public renderInfo(circle: Circle): JSX.Element[] {
    return map(infoMapping, ({ title, render }, idx) => {
      let rendered = render(circle);
      if (typeof rendered === 'string') {
        rendered = <span>{rendered}</span>;
      } else if (rendered instanceof Array) {
        if (typeof rendered[0] === 'string') {
          rendered = this.renderList(rendered as string[]);
        }
      } else if (!rendered) {
        return null;
      }

      return (
        <div key={idx} className={styles.info}>
          <span>{title}</span>
          {rendered}
        </div>
      );
    }).filter(el => !!el);
  }

  public renderList(items: string[]) {
    return (
      <ul>
        {map(items, (item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }

  private registerListener() {
    if (this.mc) {
      return;
    }
    const header = this.headerRef.current;
    if (!header) {
      return;
    }
    this.mc = new Hammer.Manager(header);
    this.mc.add(new Hammer.Pan({ threshold: 0, pointers: 1 }));
    this.mc.on('panstart panup pandown panend', this.onPanMove);
  }

  private onWindowResize = () => {
    this.updateCard();
  };

  @action
  private onPanMove = (evt: HammerInput) => {
    const { props, panState } = this;
    const { pulled, onCardPulled, onCardHidden, onCardTabbed } = props;
    const container = this.containerRef.current;
    if (!container) {
      return;
    }
    const bottom = panState.startBottom - evt.deltaY;
    if (evt.type === 'panstart') {
      panState.startBottom = panState.currentBottom;
      this.setState({ pulling: true });
    } else if (evt.type === 'panend') {
      this.setState({ pulling: false });
      const reachThreshold =
        Math.abs(evt.deltaY) >= PULL_DELTA_THRESHOLD ||
        Math.abs(evt.velocityY) >= PULL_VELOCITY_THRESHOLD;
      if (Math.sign(evt.deltaY) <= 0) {
        if (reachThreshold) {
          panState.wasPulled = true;
          onCardPulled();
        }
      } else {
        if (-bottom >= container.clientHeight - SHOWN_HEIGHT_THRESHOLD) {
          panState.wasPulled = false;
          onCardHidden();
        } else if (pulled && reachThreshold) {
          panState.wasPulled = false;
          onCardTabbed();
        } else if (!panState.wasPulled) {
          onCardHidden();
        }
      }
      return;
    }
    this.updateContainerPosition(bottom);
  };

  private updateContainerPosition(bottom: number) {
    if (bottom > 0) {
      return;
    }
    const overlay = this.overlayRef.current;
    const container = this.containerRef.current;
    const header = this.headerRef.current;
    if (!overlay || !container || !header) {
      return;
    }
    const opacity = Math.min(
      Math.max(0, 1.0 + bottom / (container.clientHeight - header.clientHeight)),
      1.0,
    );
    overlay.style.setProperty('opacity', '' + opacity);
    this.panState.currentBottom = bottom;
    container.style.setProperty('bottom', `${bottom}px`);
  }
}
