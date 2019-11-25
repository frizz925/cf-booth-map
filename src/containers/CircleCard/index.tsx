import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import { SocialType } from '@models/Social';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import map from 'lodash/map';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import * as styles from './styles.css';

const PULL_DELTA_THRESHOLD = 80;
const PULL_VELOCITY_THRESHOLD = 0.5;

export interface CircleCardStore {
  cardShown: boolean;
  cardPulled: boolean;
  cardPulling: boolean;
  selectedCircle: Circle;
}

export interface CircleCardProps {
  store: CircleCardStore;
}

interface InfoMapping {
  title: string;
  render: (circle: Circle) => string | string[] | JSX.Element | JSX.Element[];
}

const defaultSocialIcon = faGlobe;
const socialIcons = {
  [SocialType.Facebook]: faFacebook,
  [SocialType.Twitter]: faTwitter,
  [SocialType.Instagram]: faInstagram,
  [SocialType.Web]: defaultSocialIcon,
};

const infoMapping: InfoMapping[] = [
  {
    title: 'Categories',
    render: ({ categories }) => categories,
  },
  {
    title: 'Fandoms',
    render: ({ fandoms }) => fandoms,
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

@observer
export default class CircleCard extends PureComponent<CircleCardProps> {
  private containerRef = React.createRef<HTMLDivElement>();
  private headerRef = React.createRef<HTMLDivElement>();

  private mc: HammerManager;
  private panState = {
    startBottom: 0,
    currentBottom: 0,
    wasPulled: false,
  };

  public componentDidMount() {
    this.updateCard();
    this.registerListener();
  }

  public componentDidUpdate() {
    this.updateCard();
    this.registerListener();
  }

  public updateCard() {
    const {
      cardShown: shown,
      cardPulled: pulled,
      selectedCircle: selected,
    } = this.props.store;
    const container = this.containerRef.current;
    if (!container) {
      return;
    }
    let bottom = 0;
    if (!selected || !shown) {
      bottom = -container.clientHeight;
    } else if (shown && !pulled) {
      bottom = -(container.clientHeight - this.headerRef.current.clientHeight);
    }
    this.updateContainerPosition(bottom);
  }

  public render() {
    const { selectedCircle: circle } = this.props.store;
    return circle ? this.renderCard(circle) : '';
  }

  public renderCard(circle: Circle): JSX.Element {
    const {
      cardShown: shown,
      cardPulled: pulled,
      cardPulling: pulling,
    } = this.props.store;
    const containerClassNames = classNames(styles.container, {
      [styles.shown]: shown,
      [styles.pulled]: pulled,
      [styles.pulling]: pulling,
    });
    return (
      <div ref={this.containerRef} className={containerClassNames}>
        <div ref={this.headerRef} className={styles.header}>
          <div className={styles.puller}>
            <span />
            <span />
          </div>
          <div className={styles.title}>{circle.name}</div>
          <div className={styles.number}>{circle.boothNumber}</div>
        </div>
        <div className={styles.body}>
          <div className={styles.image}>
            <img src={circle.imageUrl} alt={circle.name} />
          </div>
          <div className={styles.details}>{this.renderInfo(circle)}</div>
        </div>
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

  public renderList(items: string[]): JSX.Element {
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

  private onPanMove = (evt: HammerInput) => {
    const { props, panState } = this;
    const { store } = props;
    const container = this.containerRef.current;
    if (!container) {
      return;
    }
    if (evt.type === 'panstart') {
      panState.startBottom = panState.currentBottom;
      store.cardPulling = true;
    } else if (evt.type === 'panend') {
      if (
        Math.abs(evt.deltaY) >= PULL_DELTA_THRESHOLD ||
        Math.abs(evt.velocityY) >= PULL_VELOCITY_THRESHOLD
      ) {
        if (Math.sign(evt.deltaY) <= 0) {
          store.cardPulled = panState.wasPulled = true;
        } else if (store.cardPulled) {
          store.cardPulled = panState.wasPulled = false;
        } else if (!panState.wasPulled) {
          store.cardShown = false;
        }
      }
      store.cardPulling = false;
      return;
    }
    const bottom = panState.startBottom - evt.deltaY;
    this.updateContainerPosition(bottom);
  };

  private updateContainerPosition(bottom: number) {
    const container = this.containerRef.current;
    if (!container) {
      return;
    }
    this.panState.currentBottom = bottom;
    container.style.setProperty('bottom', `${bottom}px`);
  }
}
