import Circle from '@models/Circle';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import styles from './styles.css';

interface ListProps {
  showSearchExpanded?: boolean;
  circleList: Circle[];
  onItemClick: (circle: Circle) => void;
}

class List extends PureComponent<ListProps> {
  public render() {
    const circles = this.props.circleList;
    const wrapperClassName = classNames(styles.formListWrapper, {
      [styles.formExpanded]: this.props.showSearchExpanded,
    });
    const listOfCircles = circles.map((circle: Circle) => {
      const clickHandler = this.createItemClickHandler(circle);
      return (
        <div key={circle.id} className={styles.formListItem} onClick={clickHandler}>
          <div className={styles.formListItemTitle}>{circle.name}</div>
          <div className={styles.formListItemText}>{circle.boothNumber}</div>
        </div>
      );
    });
    return (
      <div className={wrapperClassName}>
        <div className={styles.formList}>
          {listOfCircles}
        </div>
      </div>
    );
  }

  private createItemClickHandler(circle: Circle): () => void {
    return () => {
      this.props.onItemClick(circle);
    };
  }
}

export default List;
