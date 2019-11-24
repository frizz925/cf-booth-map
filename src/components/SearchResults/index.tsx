import Circle from '@models/Circle';
import map from 'lodash/map';
import React, { PureComponent } from 'react';
import * as styles from './styles.css';

interface Props {
  className?: string;
  circles: Circle[];
}

class SearchResults extends PureComponent<Props> {
  public render() {
    const { className, circles } = this.props;
    const circleElements = map(circles, circle => this.renderCircle(circle));
    return (
      <div className={className}>
        <div className={styles.searchResultList}>{circleElements}</div>
      </div>
    );
  }

  private renderCircle(circle: Circle): JSX.Element {
    return (
      <div className={styles.searchResultItem}>
        <h3>{circle.name}</h3>
        <span>{circle.boothNumber}</span>
      </div>
    );
  }
}

export default SearchResults;
