import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import React from 'react';
import * as styles from './styles.scss';

interface HeaderProps {
  circle?: Circle;
  forwardRef?: React.Ref<HTMLDivElement>;
  bookmarked: boolean;
  onBookmark: () => void;
  onUnbookmark: () => void;
}

const Header: React.FC<HeaderProps> = props => {
  const { circle, forwardRef, bookmarked, onBookmark, onUnbookmark } = props;
  const handleBookmark = () => {
    (bookmarked ? onUnbookmark : onBookmark)();
  };
  return (
    <div ref={forwardRef} className={styles.header}>
      <div className={styles.puller}>
        <span />
      </div>
      <div className={styles.headerContent}>
        <div className={styles.title}>{circle ? circle.name : ''}</div>
        <div className={styles.number}>{circle ? circle.boothNumber : ''}</div>
        <div className={`${styles.action} ${styles.right}`} onClick={handleBookmark}>
          <FontAwesomeIcon icon={bookmarked ? faSolidBookmark : faBookmark} />
        </div>
      </div>
    </div>
  );
};

export default Header;
