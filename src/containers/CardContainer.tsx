import CircleCard from '@components/CircleCard';
import Circle from '@models/Circle';
import CardPresenter from '@presenters/CardPresenter';
import React, { useEffect, useState } from 'react';

export default ({ presenter }: { presenter: CardPresenter }) => {
  const [shown, setShown] = useState(presenter.shown.value);
  const [pulled, setPulled] = useState(presenter.pulled.value);
  const [circle, setCircle] = useState<Circle | undefined>(presenter.circle.value);
  const [bookmarked, setBookmarked] = useState(false);

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
    ];
    return () => subscribers.forEach(s => s.unsubscribe());
  }, []);

  const onBookmark = async () => {
    await presenter.bookmark(circle);
    setBookmarked(true);
  };

  const onUnbookmark = async () => {
    await presenter.unbookmark(circle);
    setBookmarked(false);
  };

  return (
    <CircleCard
      circle={circle}
      bookmarked={bookmarked}
      shown={shown}
      pulled={pulled}
      onBookmark={onBookmark}
      onUnbookmark={onUnbookmark}
      onOverlayClick={() => presenter.tab()}
      onCardPulled={() => presenter.pull()}
      onCardHidden={() => presenter.hide()}
      onCardTabbed={() => presenter.tab()}
    />
  );
};
