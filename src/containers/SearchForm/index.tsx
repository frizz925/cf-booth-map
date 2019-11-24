import SearchBox from '@components/SearchBox';
import SearchResults from '@components/SearchResults';
import Circle from '@models/Circle';
import CircleRepository from '@repositories/CircleRepository';
import classNames from 'classnames';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import { Subject, Subscription } from 'rxjs';
import * as styles from './styles.css';

export interface SearchFormStore {
  focused: boolean;
  searchText: string;
}

interface SearchFormProps {
  store: SearchFormStore;
  repository: CircleRepository;
}

@observer
export default class SearchForm extends PureComponent<SearchFormProps> {
  @observable
  private circles: Circle[] = [];

  private querySubject = new Subject<string>();
  private querySubscription: Subscription;

  public componentDidMount() {
    const { repository } = this.props;
    repository.fetch().then(
      circles => this.updateCircles(circles),
      err => console.error(err),
    );

    this.querySubscription = this.querySubject.subscribe(query => {
      const filtered = repository.findCircles(query);
      this.updateCircles(filtered);
    });
  }

  public componentWillUnmount() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  public render() {
    const { props, circles } = this;
    const { focused, searchText } = props.store;
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

  private updateCircles(circles: Circle[]) {
    this.circles.length = 0;
    this.circles.push(...circles);
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
    this.querySubject.next('');
  };

  private onSearchBoxTextChanged = (value: string) => {
    this.props.store.searchText = value;
    this.querySubject.next(value);
  };
}
