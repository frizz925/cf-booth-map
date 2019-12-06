import CircleCard from '@components/CircleCard';
import Circle from '@models/Circle';
import CardPresenter from '@presenters/CardPresenter';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { filter } from 'rxjs/operators';

export default ({ presenter }: { presenter: CardPresenter }) => {
  const [shown, setShown] = useState(presenter.shown.value);
  const [pulled, setPulled] = useState(presenter.pulled.value);
  const [circle, setCircle] = useState<Circle | undefined>(presenter.circle.value);
  const [bookmarked, setBookmarked] = useState(false);

  const circleRef = useRef(circle);
  const circleFilter = filter(
    (value: Circle) => circleRef.current && value && circleRef.current.id === value.id,
  );

  useEffect(() => {
    circleRef.current = circle;
  }, [circle]);

  useEffect(() => {
    const subscribers = [
      presenter.shown.subscribe(setShown),
      presenter.pulled.subscribe(setPulled),
      presenter.circle.subscribe(value => {
        setCircle(value);
        if (value) {
          presenter.isBookmarked(value).then(setBookmarked);
        } else {
          setBookmarked(false);
        }
      }),
      presenter.onAdd.pipe(circleFilter).subscribe(() => setBookmarked(true)),
      presenter.onRemove.pipe(circleFilter).subscribe(() => setBookmarked(false)),
    ];
    return () => subscribers.forEach(s => s.unsubscribe());
  }, [presenter]);

  return (
    <CircleCard
      circle={circle}
      bookmarked={bookmarked}
      shown={shown}
      pulled={pulled}
      onBookmark={useCallback(() => presenter.bookmark(circle), [presenter, circle])}
      onUnbookmark={useCallback(() => presenter.unbookmark(circle), [presenter, circle])}
      onOverlayClick={useCallback(() => presenter.tab(), [presenter])}
      onCardPulled={useCallback(() => presenter.pull(), [presenter])}
      onCardHidden={useCallback(() => presenter.hide(), [presenter])}
      onCardTabbed={useCallback(() => presenter.tab(), [presenter])}
    />
  );
};
