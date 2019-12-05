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
import map from 'lodash/map';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as styles from './styles.scss';

const PULL_DELTA_THRESHOLD = 80;
const PULL_VELOCITY_THRESHOLD = 0.5;
const VISIBLE_HEIGHT_THRESHOLD = 0;

export interface CircleCardProps {
  circle?: Circle;
  shown: boolean;
  pulled: boolean;

  onOverlayClick: () => void;
  onCardPulled: () => void;
  onCardHidden: () => void;
  onCardTabbed: () => void;
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

const renderCardBody = (circle: Circle) => (
  <div className={styles.body}>
    <div className={styles.image}>
      <LazyImage src={circle.imageUrl} alt={circle.name} width={160} height={240} />
    </div>
    <div className={styles.details}>{renderInfo(circle)}</div>
  </div>
);

const renderInfo = (circle: Circle) =>
  map(infoMapping, ({ title, render }, idx) => {
    let rendered = render(circle);
    if (typeof rendered === 'string') {
      rendered = <span>{rendered}</span>;
    } else if (rendered instanceof Array) {
      if (typeof rendered[0] === 'string') {
        rendered = renderList(rendered as string[]);
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

const renderList = (items: string[]) => {
  return (
    <ul>
      {map(items, (item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
};

export default (props: CircleCardProps) => {
  const [pulling, setPulling] = useState(false);

  const propsRef = useRef(props);
  const overlayRef = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();
  const headerRef = useRef<HTMLDivElement>();
  const panStateRef = useRef({
    startBottom: 0,
    currentBottom: 0,
    wasPulled: false,
  });

  const updateCard = () => {
    const { shown, pulled } = propsRef.current;
    const panState = panStateRef.current;
    const container = containerRef.current;
    panState.wasPulled = pulled;
    if (!container) {
      return;
    }
    let bottom = 0;
    if (!shown) {
      bottom = -container.clientHeight;
    } else if (shown && !pulled) {
      bottom = -(container.clientHeight - headerRef.current.clientHeight);
    }
    updateContainerPosition(bottom);
  };

  const onPanMove = (evt: HammerInput) => {
    const { pulled, onCardPulled, onCardHidden, onCardTabbed } = propsRef.current;
    const panState = panStateRef.current;
    const container = containerRef.current;
    const header = headerRef.current;
    const bottom = panState.startBottom - evt.deltaY;
    if (evt.type === 'panstart') {
      panState.startBottom = panState.currentBottom;
      setPulling(true);
    } else if (evt.type === 'panend') {
      setPulling(false);
      const reachThreshold =
        Math.abs(evt.deltaY) >= PULL_DELTA_THRESHOLD ||
        Math.abs(evt.velocityY) >= PULL_VELOCITY_THRESHOLD;
      if (Math.sign(evt.deltaY) <= 0) {
        if (reachThreshold) {
          panState.wasPulled = true;
          onCardPulled();
        }
      } else {
        const hiddenThreshold =
          container.clientHeight - header.clientHeight / 2 + VISIBLE_HEIGHT_THRESHOLD;
        if (-bottom >= hiddenThreshold) {
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
    updateContainerPosition(bottom);
  };

  const updateContainerPosition = (bottom: number) => {
    if (bottom > 0) {
      return;
    }
    const panState = panStateRef.current;
    const overlay = overlayRef.current;
    const container = containerRef.current;
    const header = headerRef.current;
    const opacity = Math.min(
      Math.max(0, 1.0 + bottom / (container.clientHeight - header.clientHeight)),
      1.0,
    );
    overlay.style.setProperty('opacity', `${opacity}`);
    panState.currentBottom = bottom;
    container.style.setProperty('bottom', `${bottom}px`);
  };

  useEffect(() => {
    window.addEventListener('resize', updateCard);
    const mc = new Hammer.Manager(headerRef.current);
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 1 }));
    mc.on('panstart panup pandown panend', onPanMove);
    return () => {
      mc.destroy();
      window.removeEventListener('resize', updateCard);
    };
  }, []);

  useLayoutEffect(() => {
    propsRef.current = props;
    updateCard();
  });

  const render = () => {
    const { circle, shown, pulled, onOverlayClick } = props;
    const classModifiers = {
      [styles.shown]: shown,
      [styles.pulled]: pulled,
      [styles.pulling]: pulling,
    };
    const overlayClassNames = classNames(
      'overlay-generic',
      { 'overlay-visible': shown },
      styles.overlay,
      classModifiers,
    );
    const containerClassNames = classNames(styles.container, classModifiers);
    return (
      <div>
        <div ref={overlayRef} className={overlayClassNames} onClick={onOverlayClick} />
        <div ref={containerRef} className={containerClassNames}>
          <div ref={headerRef} className={styles.header}>
            <div className={styles.puller}>
              <span />
            </div>
            <div className={styles.title}>{circle ? circle.name : ''}</div>
            <div className={styles.number}>{circle ? circle.boothNumber : ''}</div>
          </div>
          {circle ? renderCardBody(circle) : null}
        </div>
      </div>
    );
  };

  return render();
};
