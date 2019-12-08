import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import CircleBookmark from '@models/CircleBookmark';
import { details } from '@models/formatters/CircleFormatter';
import classNames from 'classnames';
import map from 'lodash/map';
import React from 'react';
import * as styles from './styles.scss';

export type CircleHandler = (circle: Circle) => void;

export interface SearchResultsProps {
  isLoading: boolean;
  className?: string;
  circles: CircleBookmark[];
  onSelected: CircleHandler;
  onBookmarked: CircleHandler;
  onUnbookmarked: CircleHandler;
}

interface ResultRowProps {
  circle: CircleBookmark;
  onSelected: CircleHandler;
  onBookmarked: CircleHandler;
  onUnbookmarked: CircleHandler;
}

const ResultRow = ({
  circle,
  onSelected,
  onBookmarked,
  onUnbookmarked,
}: ResultRowProps) => {
  const { bookmarked } = circle;
  const handleSelect = () => onSelected(circle);
  const handleBookmark = () => (bookmarked ? onUnbookmarked : onBookmarked)(circle);

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
        <FontAwesomeIcon icon={bookmarked ? faSolidBookmark : faBookmark} />
      </div>
    </div>
  );
};

const Loading = () => (
  <div className={styles.searchResultItem}>
    <div className={styles.searchResultDetails}>Searching...</div>
  </div>
);

const renderCircles = ({
  circles,
  onSelected,
  onBookmarked,
  onUnbookmarked,
}: SearchResultsProps) => {
  return map(circles, circle => (
    <ResultRow
      key={circle.id}
      circle={circle}
      onSelected={onSelected}
      onBookmarked={onBookmarked}
      onUnbookmarked={onUnbookmarked}
    />
  ));
};

const SearchResults: React.FC<SearchResultsProps> = props => {
  const { className, isLoading } = props;
  return (
    <div className={className}>
      <div className={styles.searchResultList}>
        {isLoading ? <Loading /> : renderCircles(props)}
      </div>
    </div>
  );
};

export default SearchResults;
