import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import { details } from '@models/formatters/CircleFormatter';
import classNames from 'classnames';
import React from 'react';
import * as styles from './styles.scss';

interface HeaderProps {
  circle?: Circle;
  forwardRef?: React.Ref<HTMLDivElement>;
  bookmarked: boolean;
  onBookmarked: () => void;
  onUnbookmarked: () => void;
}

const Header: React.FC<HeaderProps> = props => {
  const { circle, forwardRef, bookmarked, onBookmarked, onUnbookmarked } = props;
  const handleBookmark = () => {
    (bookmarked ? onUnbookmarked : onBookmarked)();
  };
  const actionClassNames = classNames(styles.action, styles.right, {
    [styles.active]: bookmarked,
  });
  return (
    <div ref={forwardRef} className={styles.header}>
      <div className={styles.puller}>
        <span />
      </div>
      <div className={styles.headerContent}>
        <div className={styles.title}>{circle ? circle.name : ''}</div>
        <div className={styles.number}>{circle ? details(circle) : ''}</div>
        <div className={actionClassNames} onClick={handleBookmark}>
          <FontAwesomeIcon icon={bookmarked ? faSolidBookmark : faBookmark} />
        </div>
      </div>
    </div>
  );
};

export default Header;
