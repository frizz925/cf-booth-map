import SearchBox from '@components/SearchBox';
import SearchResults from '@components/SearchResults';
import Circle from '@models/Circle';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import * as styles from './styles.css';

export interface SearchFormStore {
  focused: boolean;
  searchText: string;
}

interface SearchFormProps {
  store: SearchFormStore;
  circles: Circle[];
}

@observer
export default class SearchForm extends PureComponent<SearchFormProps> {
  public render() {
    const { store, circles } = this.props;
    const { focused, searchText } = store;
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
          onAction={this.onSearchBoxAction}
          onBack={this.onSearchBoxBack}
          onClick={this.onSearchBoxClick}
          onClear={this.onSearchBoxClear}
          onTextChanged={this.onSearchBoxTextChanged}
        />
        <SearchResults className={searchResultsClassNames} circles={circles} />
      </div>
    );
  }

  private onSearchBoxAction = () => {
    // TODO: Create drawer
  };

  private onSearchBoxBack = () => {
    const { store } = this.props;
    if (!store.focused) {
      return;
    }
    store.focused = false;
    store.searchText = '';
  };

  private onSearchBoxClick = () => {
    const { store } = this.props;
    if (store.focused) {
      return;
    }
    store.focused = true;
  };

  private onSearchBoxClear = () => {
    this.props.store.searchText = '';
  };

  private onSearchBoxTextChanged = (value: string) => {
    this.props.store.searchText = value;
  };
}
