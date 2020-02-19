import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import { details } from '@models/formatters/CircleFormatter';
import classNames from 'classnames';
import React, { Ref } from 'react';
import * as styles from './styles.scss';

interface HeaderProps {
  circle?: Circle;
  headerRef?: Ref<HTMLDivElement>;
  previewRef?: Ref<HTMLDivElement>;
  actionsRef?: Ref<HTMLDivElement>;
  bookmarked: boolean;
  onBookmarked: () => void;
  onUnbookmarked: () => void;
}

const Header: React.FC<HeaderProps> = ({
  circle,
  headerRef,
  previewRef,
  actionsRef,
  bookmarked,
  onBookmarked,
  onUnbookmarked,
}) => {
  const handleBookmark = () => {
    (bookmarked ? onUnbookmarked : onBookmarked)();
  };
  const actionClassNames = classNames(styles.actionItem, {
    [styles.active]: bookmarked,
  });
  return (
    <div ref={headerRef} className={styles.header}>
      <div ref={previewRef} className={styles.preview}>
        <div className={styles.puller}>
          <span />
        </div>
        <div className={styles.details}>
          <div className={styles.title}>{circle ? circle.name : ''}</div>
          <div className={styles.number}>{circle ? details(circle) : ''}</div>
        </div>
      </div>
      <div ref={actionsRef} className={styles.actions}>
        <div className={actionClassNames} onClick={handleBookmark}>
          <span className={styles.actionIcon}>
            <FontAwesomeIcon icon={bookmarked ? faSolidHeart : faHeart} />
          </span>
          <span className={styles.actionText}>{bookmarked ? 'Saved' : 'Favorite'}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
