import CircleCard from '@components/CircleCard';
import Circle from '@models/Circle';
import CardPresenter from '@presenters/CardPresenter';
import React, { useEffect, useState } from 'react';

export default ({ presenter }: { presenter: CardPresenter }) => {
  const [shown, setShown] = useState(presenter.shown.value);
  const [pulled, setPulled] = useState(presenter.pulled.value);
  const [circle, setCircle] = useState<Circle | undefined>();

  useEffect(() => {
    const subscribers = [
      presenter.shown.subscribe(setShown),
      presenter.pulled.subscribe(setPulled),
      presenter.circle.subscribe(setCircle),
    ];
    return () => subscribers.forEach(s => s.unsubscribe());
  });

  return (
    <CircleCard
      circle={circle}
      shown={shown}
      pulled={pulled}
      onOverlayClick={() => presenter.tab()}
      onCardPulled={() => presenter.pull()}
      onCardHidden={() => presenter.hide()}
      onCardTabbed={() => presenter.tab()}
    />
  );
};
