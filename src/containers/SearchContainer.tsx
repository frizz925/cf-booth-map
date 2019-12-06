import SearchForm from '@components/SearchForm';
import Circle from '@models/Circle';
import SearchPresenter from '@presenters/SearchPresenter';
import { pushCircle } from '@utils/Routing';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

export default ({ presenter }: { presenter: SearchPresenter }) => {
  const history = useHistory();
  const [circles, setCircles] = useState([] as Circle[]);
  const [shown, setShown] = useState(presenter.shown.value);
  const [focused, setFocused] = useState(presenter.focused.value);
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const subscribers = [
      presenter.shown.subscribe(setShown),
      presenter.focused.subscribe(setFocused),
    ];
    return () => subscribers.forEach(s => s.unsubscribe());
  }, [presenter]);

  const onClear = useCallback(() => {
    setSearchText('');
    setCircles([]);
  }, []);

  const onTextChanged = useCallback(
    async (value: string) => {
      setSearchText(value);
      setSearching(true);
      const results = await presenter.search(value);
      setCircles(results);
      setSearching(false);
    },
    [presenter],
  );

  return (
    <SearchForm
      circles={circles}
      shown={shown}
      focused={focused}
      searching={searching}
      searchText={searchText}
      onFocus={useCallback(() => presenter.focused.next(true), [presenter])}
      onAction={useCallback(() => presenter.action.next(), [presenter])}
      onBack={useCallback(() => presenter.focused.next(false), [presenter])}
      onClear={onClear}
      onTextChanged={onTextChanged}
      onResultSelected={useCallback(circle => pushCircle(history, circle), [history])}
    />
  );
};
