import Circle from '@models/Circle';
import map from 'lodash/map';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import * as styles from './styles.css';

interface Props {
  className?: string;
  circles: Circle[];
  onSelected: (circle: Circle) => void;
}

@observer
export default class SearchResults extends PureComponent<Props> {
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
