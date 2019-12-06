import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Circle from '@models/Circle';
import BookmarksPresenter from '@presenters/pages/BookmarksPresenter';
import map from 'lodash/map';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import * as styles from './styles.scss';

type BookmarkHandler = (circle: Circle) => void;

interface BookmarkItemProps {
  circle: Circle;
  onSelected: BookmarkHandler;
  onRemove: BookmarkHandler;
}

const BookmarkItem: React.FC<BookmarkItemProps> = props => {
  const { circle, onSelected, onRemove } = props;
  return (
    <div className={styles.item}>
      <div className={styles.details} onClick={() => onSelected(circle)}>
        <h3 className={styles.title}>{circle.name}</h3>
        <div className={styles.number}>{circle.boothNumber}</div>
      </div>
      <div className={styles.action} onClick={() => onRemove(circle)}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
    </div>
  );
};

const renderBookmarks = (
  circles: Circle[],
  onSelected: BookmarkHandler,
  onRemove: BookmarkHandler,
) => {
  return map(circles, circle => (
    <BookmarkItem
      key={circle.id}
      circle={circle}
      onSelected={onSelected}
      onRemove={onRemove}
    />
  ));
};

export default ({ presenter }: { presenter: BookmarksPresenter }) => {
  const history = useHistory();
  const [circles, setCircles] = useState([] as Circle[]);

  const updateCircles = () => {
    presenter.getAllBookmarks().then(setCircles);
  };

  const onSelected = (circle: Circle) => {
    history.push('/');
    setTimeout(() => {
      presenter.circle.next(circle);
    }, 450);
  };
  const onRemove = (circle: Circle) => {
    presenter.removeBookmark(circle);
  };

  useEffect(() => {
    const subscribers = [
      presenter.onAdd.subscribe(updateCircles),
      presenter.onRemove.subscribe(updateCircles),
    ];
    return () => subscribers.forEach(s => s.unsubscribe());
  }, [presenter]);

  useEffect(updateCircles, []);

  return (
    <div className={styles.container}>
      {circles.length > 0
        ? renderBookmarks(circles, onSelected, onRemove)
        : "You haven't added any circle to your bookmarks yet!"}
    </div>
  );
};
