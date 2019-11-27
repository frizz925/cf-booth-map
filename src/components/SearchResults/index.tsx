import Circle from '@models/Circle';
import map from 'lodash/map';
import React, { PureComponent } from 'react';
import * as styles from './styles.scss';

interface Props {
  isLoading: boolean;
  className?: string;
  circles: Circle[];
  onSelected: (circle: Circle) => void;
}

export default class SearchResults extends PureComponent<Props> {
  public render() {
    const { className, circles, isLoading } = this.props;
    return (
      <div className={className}>
        <div className={styles.searchResultList}>
          {isLoading ? this.renderLoader() : this.renderCircles(circles)}
        </div>
      </div>
    );
  }

  public renderLoader() {
    return <div className={styles.searchResultItem}>Loading...</div>;
  }

  public renderCircles(circles: Circle[]): JSX.Element[] {
    return map(circles, circle => this.renderCircle(circle));
  }

  public renderCircle(circle: Circle): JSX.Element {
    const { onSelected } = this.props;
    return (
      <div
        key={circle.id}
        className={styles.searchResultItem}
        onClick={() => onSelected(circle)}
      >
        <h3>{circle.name}</h3>
        <span>{circle.boothNumber}</span>
      </div>
    );
  }
}
