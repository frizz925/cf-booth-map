import SearchForm from '@components/SearchForm';
import Circle from '@models/Circle';
import SearchPresenter from '@presenters/SearchPresenter';
import React, { useEffect, useState } from 'react';

export default ({ presenter }: { presenter: SearchPresenter }) => {
  const [circles, setCircles] = useState([] as Circle[]);
  const [focused, setFocused] = useState(presenter.focused.value);
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const subscriber = presenter.focused.subscribe(setFocused);
    return () => subscriber.unsubscribe();
  });

  const onClear = () => {
    setSearchText('');
    setCircles([]);
  };

  const onTextChanged = (value: string) => {
    setSearchText(value);
    setSearching(true);
    presenter.search(value).then(results => {
      setCircles(results);
      setSearching(false);
    });
  };

  return (
    <SearchForm
      circles={circles}
      focused={focused}
      searching={searching}
      searchText={searchText}
      onFocus={() => presenter.focused.next(true)}
      onAction={() => presenter.action.next()}
      onBack={() => presenter.focused.next(false)}
      onClear={onClear}
      onTextChanged={onTextChanged}
      onResultSelected={circle => presenter.select(circle)}
    />
  );
};
