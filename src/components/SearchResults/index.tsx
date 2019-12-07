import Circle from '@models/Circle';
import { details } from '@models/formatters/CircleFormatter';
import map from 'lodash/map';
import React from 'react';
import * as styles from './styles.scss';

type CircleHandler = (circle: Circle) => void;

export interface SearchResultsProps {
  isLoading: boolean;
  className?: string;
  circles: Circle[];
  onSelected: CircleHandler;
}

interface ResultRowProps {
  circle: Circle;
  onSelected: CircleHandler;
}

const ResultRow = ({ circle, onSelected }: ResultRowProps) => {
  return (
    <div className={styles.searchResultItem} onClick={() => onSelected(circle)}>
      <h3>{circle.name}</h3>
      <span>{details(circle)}</span>
    </div>
  );
};

const Loading = () => <div className={styles.searchResultItem}>Loading...</div>;

const renderCircles = (circles: Circle[], onSelected: CircleHandler) => {
  return map(circles, circle => (
    <ResultRow key={circle.id} circle={circle} onSelected={onSelected} />
  ));
};

const SearchResults: React.FC<SearchResultsProps> = props => {
  const { className, isLoading, circles, onSelected } = props;
  return (
    <div className={className}>
      <div className={styles.searchResultList}>
        {isLoading ? <Loading /> : renderCircles(circles, onSelected)}
      </div>
    </div>
  );
};

export default SearchResults;
