import Snackbar from '@components/Snackbar';
import SnackbarPresenter from '@presenters/SnackbarPresenter';
import React, { useEffect, useState } from 'react';

export default ({ presenter }: { presenter: SnackbarPresenter }) => {
  const [shown, setShown] = useState(presenter.shown);
  const [content, setContent] = useState(presenter.content);
  const { message, action } = content;

  useEffect(() => {
    const subscribers = [presenter.onShown(setShown), presenter.onContent(setContent)];
    return () => subscribers.forEach(s => s.unsubscribe());
  }, [presenter]);

  useEffect(() => {
    if (action || !shown) {
      return;
    }
    setTimeout(() => presenter.result(false), 4000);
  }, [action, shown]);

  return (
    <Snackbar
      shown={shown}
      message={message}
      action={action}
      onResult={result => presenter.result(result)}
    />
  );
};
