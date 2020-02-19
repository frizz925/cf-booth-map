import CircleList from '@components/CircleList';
import Circle from '@models/Circle';
import CircleBookmark from '@models/CircleBookmark';
import BookmarksPresenter from '@presenters/pages/BookmarksPresenter';
import { pushCircle } from '@utils/Routing';
import map from 'lodash/map';
import merge from 'lodash/merge';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import * as styles from './styles.scss';

const circleBookmarks = (circles: Circle[]) =>
  map(circles, circle => merge(circle, { bookmarked: true } as CircleBookmark));

const NoBookmarks = () => {
  return (
    <div className={styles.noBookmarks}>
      You haven't saved any circle to your favorites yet!
    </div>
  );
};

export default ({ presenter }: { presenter: BookmarksPresenter }) => {
  const history = useHistory();
  const [circles, setCircles] = useState([] as Circle[]);

  const onSelected = useCallback(circle => pushCircle(history, circle), [history]);

  const onRemove = useCallback(
    (circle: Circle) => {
      presenter.removeBookmark(circle);
    },
    [presenter],
  );

  const updateCircles = () => {
    presenter.getAllBookmarks().then(setCircles);
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
      {circles.length > 0 ? (
        <CircleList
          circles={circleBookmarks(circles)}
          onSelected={onSelected}
          onUnbookmarked={onRemove}
        />
      ) : (
        <NoBookmarks />
      )}
    </div>
  );
};
