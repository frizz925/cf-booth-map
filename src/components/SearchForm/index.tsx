import CircleList, { CircleHandler } from '@components/CircleList';
import SearchBox from '@components/SearchBox';
import CircleBookmark from '@models/CircleBookmark';
import classNames from 'classnames';
import React from 'react';
import * as styles from './styles.scss';

interface SearchFormProps {
  circles: CircleBookmark[];
  shown: boolean;
  focused: boolean;
  searching: boolean;
  searchText: string;

  onBack: () => void;
  onFocus: () => void;
  onClear: () => void;
  onTextChanged: (value: string) => void;

  onResultSelected: CircleHandler;
  onResultBookmarked: CircleHandler;
  onResultUnbookmarked: CircleHandler;
}

const SearchForm: React.FC<SearchFormProps> = ({
  shown,
  focused,
  searching,
  circles,
  searchText,
  onBack,
  onFocus,
  onClear,
  onTextChanged,
  onResultSelected,
  onResultBookmarked,
  onResultUnbookmarked,
}) => {
  const focusedClassName = focused ? styles.focused : '';
  const containerClassNames = classNames(styles.container, focusedClassName);
  const searchBoxClassNames = classNames(styles.searchBoxContainer, focusedClassName, {
    [styles.shown]: shown,
  });
  const searchResultsClassNames = classNames(
    styles.searchResultsContainer,
    focusedClassName,
  );
  return (
    <div className={containerClassNames}>
      <SearchBox
        className={searchBoxClassNames}
        docked={focused}
        value={searchText}
        onBack={onBack}
        onFocus={onFocus}
        onClear={onClear}
        onTextChanged={onTextChanged}
      />
      <CircleList
        className={searchResultsClassNames}
        isLoading={searching}
        circles={circles}
        onSelected={onResultSelected}
        onBookmarked={onResultBookmarked}
        onUnbookmarked={onResultUnbookmarked}
      />
    </div>
  );
};

export default SearchForm;
