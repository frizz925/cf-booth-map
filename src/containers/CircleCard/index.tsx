import Circle from '@models/Circle';
import classNames from 'classnames';
import map from 'lodash/map';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import * as styles from './styles.css';

export interface CircleCardStore {
  selectedCircle?: Circle;
}

export interface CircleCardProps {
  store: CircleCardStore;
  shown: boolean;
}

interface InfoMapping {
  title: string;
  render: (circle: Circle) => string | string[];
}

const infoMapping: InfoMapping[] = [
  {
    title: 'Categories',
    render: ({ categories }) => categories,
  },
  {
    title: 'Fandoms',
    render: ({ fandoms }) => fandoms,
  },
];

@observer
export default class CircleCard extends PureComponent<CircleCardProps> {
  public render() {
    const { store, shown } = this.props;
    const { selectedCircle: circle } = store;
    const containerClassNames = classNames(styles.container, {
      [styles.shown]: shown,
    });
    return (
      <div className={containerClassNames}>{circle ? this.renderCard(circle) : null}</div>
    );
  }

  public renderCard(circle: Circle): JSX.Element {
    return (
      <div>
        <div className={styles.puller}>
          <span />
          <span />
        </div>
        <div className={styles.header}>
          <div className={styles.title}>{circle.name}</div>
          <div className={styles.number}>{circle.boothNumber}</div>
        </div>
        <div className={styles.body}>
          <div>{this.renderInfo(circle)}</div>
          <div>
            <img src={circle.imageUrl} alt={circle.name} />
          </div>
        </div>
      </div>
    );
  }

  public renderInfo(circle: Circle): JSX.Element[] {
    return map(infoMapping, ({ title, render }, idx) => {
      const rendered = render(circle);
      return (
        <div key={idx} className={styles.info}>
          <span>{title}</span>
          {typeof rendered === 'string' ? (
            <span>{rendered}</span>
          ) : (
            this.renderList(rendered)
          )}
        </div>
      );
    });
  }

  public renderList(items: string[]): JSX.Element {
    return (
      <ul>
        {map(items, (item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  }
}
