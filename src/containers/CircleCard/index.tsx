import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import { SocialType } from '@models/Social';
import classNames from 'classnames';
import map from 'lodash/map';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import * as styles from './styles.css';

export interface CircleCardStore {
  cardShown: boolean;
  cardPulled: boolean;
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

  public componentDidMount() {
    this.updateCard();
    autorun(() => {
      this.updateCard();
    });
  }

  public componentDidUpdate() {
    this.updateCard();
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
    let containerBottom = 0;
    if (!selected || !shown) {
      containerBottom = -container.clientHeight;
    } else if (shown && !pulled) {
      containerBottom = -(container.clientHeight - this.headerRef.current.clientHeight);
    }
    container.style.setProperty('bottom', `${containerBottom}px`);
  }

  public render() {
    const { selectedCircle: circle } = this.props.store;
    return circle ? this.renderCard(circle) : '';
  }

  public renderCard(circle: Circle): JSX.Element {
    const { cardShown: shown, cardPulled: pulled } = this.props.store;
    const containerClassNames = classNames(styles.container, {
      [styles.shown]: shown,
      [styles.pulled]: pulled,
    });
    return (
      <div ref={this.containerRef} className={containerClassNames}>
        <div ref={this.headerRef} className={styles.header}>
          <div className={styles.puller} onClick={this.onPull}>
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

  private onPull = () => {
    const { store } = this.props;
    const { cardPulled } = store;
    if (cardPulled) {
      store.cardShown = false;
    }
    store.cardPulled = !cardPulled;
  };
}
