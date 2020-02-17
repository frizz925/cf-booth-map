import Circle from '@models/Circle';
import classNames from 'classnames';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Body from './Body';
import Header from './Header';
import * as styles from './styles.scss';

const PULL_DELTA_THRESHOLD = 80;
const PULL_VELOCITY_THRESHOLD = 0.5;
const VISIBLE_HEIGHT_THRESHOLD = 0;

export interface CircleCardProps {
  circle?: Circle;
  bookmarked: boolean;
  shown: boolean;
  pulled: boolean;

  onBookmarked: () => void;
  onUnbookmarked: () => void;

  onOverlayClick: () => void;
  onCardPulled: () => void;
  onCardHidden: () => void;
  onCardTabbed: () => void;

  navbar?: Element;
}

const CircleCard: React.FC<CircleCardProps> = props => {
  const [pulling, setPulling] = useState(false);

  const propsRef = useRef(props);
  const overlayRef = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();
  const headerRef = useRef<HTMLDivElement>();
  const bottomPadRef = useRef<HTMLDivElement>();
  const panStateRef = useRef({
    startBottom: 0,
    currentBottom: 0,
    wasPulled: false,
  });

  const getNavbarHeight = () => {
    const navbar = propsRef.current.navbar;
    return navbar ? navbar.clientHeight : 0;
  };

  const updateCard = () => {
    const { shown, pulled } = propsRef.current;
    const panState = panStateRef.current;
    const container = containerRef.current;
    const bottomPad = bottomPadRef.current;
    panState.wasPulled = pulled;
    if (!container || pulling) {
      return;
    }

    const navbarHeight = getNavbarHeight();
    if (bottomPad && navbarHeight > 0) {
      bottomPad.style.paddingBottom = `${navbarHeight}px`;
    }

    let bottom = 0;
    if (!shown) {
      bottom = -container.clientHeight;
    } else if (shown && !pulled) {
      bottom = -(container.clientHeight - headerRef.current.clientHeight - navbarHeight);
    }
    updateContainerPosition(bottom);
  };

  const onPanMove = (evt: HammerInput) => {
    const { pulled, onCardPulled, onCardHidden, onCardTabbed } = propsRef.current;
    const panState = panStateRef.current;
    const container = containerRef.current;
    const header = headerRef.current;
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
        const currentBottom = panState.currentBottom;
        const hiddenThreshold =
          container.clientHeight - header.clientHeight / 2 - VISIBLE_HEIGHT_THRESHOLD;
        if (-currentBottom >= hiddenThreshold) {
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
    const bottom = panState.startBottom - evt.deltaY;
    updateContainerPosition(bottom);
  };

  const updateContainerPosition = (bottom: number) => {
    if (bottom > 0) {
      return;
    }
    const navbarHeight = getNavbarHeight();
    const panState = panStateRef.current;
    const overlay = overlayRef.current;
    const container = containerRef.current;
    const header = headerRef.current;
    const currentOpacity =
      1.0 + bottom / (container.clientHeight - header.clientHeight - navbarHeight);
    const opacity = Math.min(Math.max(0, currentOpacity), 1.0);
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
    const {
      circle,
      bookmarked,
      shown,
      pulled,
      onBookmarked,
      onUnbookmarked,
      onOverlayClick,
    } = props;
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
          <Header
            forwardRef={headerRef}
            circle={circle}
            bookmarked={bookmarked}
            onBookmarked={onBookmarked}
            onUnbookmarked={onUnbookmarked}
          />
          {circle ? <Body circle={circle} bottomRef={bottomPadRef} /> : null}
        </div>
      </div>
    );
  };

  return render();
};

export default CircleCard;
