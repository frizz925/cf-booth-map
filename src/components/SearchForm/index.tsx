import SearchBox from '@components/SearchBox';
import SearchResults from '@components/SearchResults';
import Circle from '@models/Circle';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import * as styles from './styles.scss';

interface SearchFormProps {
  circles: Circle[];
  focused: boolean;
  searching: boolean;
  searchText: string;

  onAction: () => void;
  onBack: () => void;
  onFocus: () => void;
  onClear: () => void;
  onTextChanged: (value: string) => void;
  onResultSelected: (circle: Circle) => void;
}

export default class SearchForm extends PureComponent<SearchFormProps> {
  public render() {
    const {
      focused,
      searching,
      circles,
      searchText,
      onAction,
      onBack,
      onFocus,
      onClear,
      onTextChanged,
      onResultSelected,
    } = this.props;
    const focusedClassName = (focused && styles.focused) || '';
    const containerClassNames = classNames(styles.container, focusedClassName);
    const searchBoxClassNames = classNames(styles.searchBoxContainer, focusedClassName);
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
          onAction={onAction}
          onBack={onBack}
          onFocus={onFocus}
          onClear={onClear}
          onTextChanged={onTextChanged}
        />
        <SearchResults
          className={searchResultsClassNames}
          isLoading={searching}
          circles={circles}
          onSelected={onResultSelected}
        />
      </div>
    );
  }
}
