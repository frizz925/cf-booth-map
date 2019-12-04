import Circle from '@models/Circle';
import map from 'lodash/map';
import React from 'react';
import * as styles from './styles.scss';

export interface SearchResultsProps {
  isLoading: boolean;
  className?: string;
  circles: Circle[];
  onSelected: (circle: Circle) => void;
}

const renderLoader = () => <div className={styles.searchResultItem}>Loading...</div>;

const renderCircles = (props: SearchResultsProps) => {
  const { circles, onSelected } = props;
  return map(circles, circle => (
    <div
      key={circle.id}
      className={styles.searchResultItem}
      onClick={() => onSelected(circle)}
    >
      <h3>{circle.name}</h3>
      <span>{circle.boothNumber}</span>
    </div>
  ));
};

export default (props: SearchResultsProps) => {
  const { className, isLoading } = props;
  return (
    <div className={className}>
      <div className={styles.searchResultList}>
        {isLoading ? renderLoader() : renderCircles(props)}
      </div>
    </div>
  );
};
