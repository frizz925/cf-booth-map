import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import CircleBookmark from '@models/CircleBookmark';
import { details } from '@models/formatters/CircleFormatter';
import classNames from 'classnames';
import map from 'lodash/map';
import noop from 'lodash/noop';
import React from 'react';
import * as styles from './styles.scss';

export type CircleHandler = (circle: Circle) => void;

export interface CircleListProps {
  isLoading?: boolean;
  className?: string;
  circles: CircleBookmark[];
  onSelected?: CircleHandler;
  onBookmarked?: CircleHandler;
  onUnbookmarked?: CircleHandler;
}

interface CircleRowProps {
  circle: CircleBookmark;
  onSelected?: CircleHandler;
  onBookmarked?: CircleHandler;
  onUnbookmarked?: CircleHandler;
}

const CircleRow = ({
  circle,
  onSelected,
  onBookmarked,
  onUnbookmarked,
}: CircleRowProps) => {
  const { bookmarked } = circle;
  const handleSelect = () => (onSelected || noop)(circle);
  const handleBookmark = () =>
    ((bookmarked ? onUnbookmarked : onBookmarked) || noop)(circle);

  const actionClassNames = classNames(styles.searchResultAction, {
    [styles.active]: bookmarked,
  });
  return (
    <div className={styles.searchResultItem}>
      <div className={styles.searchResultDetails} onClick={handleSelect}>
        <h3>{circle.name}</h3>
        <span>{details(circle)}</span>
      </div>
      <div className={actionClassNames} onClick={handleBookmark}>
        <FontAwesomeIcon icon={bookmarked ? faSolidHeart : faHeart} />
      </div>
    </div>
  );
};

const Loading = () => (
  <div className={styles.searchResultItem}>
    <div className={styles.searchResultDetails}>Loading...</div>
  </div>
);

const renderCircles = ({
  circles,
  onSelected,
  onBookmarked,
  onUnbookmarked,
}: CircleListProps) => {
  return map(circles, circle => (
    <CircleRow
      key={circle.id}
      circle={circle}
      onSelected={onSelected}
      onBookmarked={onBookmarked}
      onUnbookmarked={onUnbookmarked}
    />
  ));
};

const CircleList: React.FC<CircleListProps> = props => {
  const { className, isLoading } = props;
  return (
    <div className={className}>
      <div className={styles.searchResultList}>
        {isLoading ? <Loading /> : renderCircles(props)}
      </div>
    </div>
  );
};

export default CircleList;
