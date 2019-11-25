import SearchBox from '@components/SearchBox';
import SearchResults from '@components/SearchResults';
import Circle from '@models/Circle';
import CircleRepository from '@repositories/CircleRepository';
import classNames from 'classnames';
import { action, autorun, IReactionDisposer, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import { Subject, Subscription } from 'rxjs';
import * as styles from './styles.scss';

export interface SearchFormStore {
  cardShown: boolean;
  cardPulled: boolean;
  focused: boolean;
  searchText: string;
  selectedCircle?: Circle;
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
  private queryDisposer: IReactionDisposer;

  private prevState = {
    cardShown: false,
    cardPulled: false,
  };

  public componentDidMount() {
    const { store, repository } = this.props;
    this.querySubscription = this.querySubject.subscribe(query => {
      repository.find(query).then(
        circles => this.updateCircles(circles),
        err => console.error(err),
      );
    });
    this.queryDisposer = autorun(() => {
      this.querySubject.next(store.searchText);
    });
  }

  public componentWillUnmount() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
      this.querySubscription = null;
    }
    if (this.queryDisposer) {
      this.queryDisposer();
      this.queryDisposer = null;
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
          onFocus={this.onSearchBoxFocus}
          onClear={this.onSearchBoxClear}
          onTextChanged={this.onSearchBoxTextChanged}
        />
        <SearchResults
          className={searchResultsClassNames}
          circles={circles}
          onSelected={this.onResultSelected}
        />
      </div>
    );
  }

  private updateCircles(circles: Circle[]) {
    this.circles.length = 0;
    this.circles.push(...circles);
  }

  @action
  private onSearchBoxAction = () => {
    this.props.store.searchText = 'Hamburger';
  };

  @action
  private onSearchBoxBack = () => {
    const { props, prevState } = this;
    const { store } = props;
    if (!store.focused) {
      return;
    }
    store.focused = false;
    store.cardPulled = prevState.cardPulled;
    store.cardShown = prevState.cardShown;
  };

  @action
  private onSearchBoxFocus = () => {
    const { props, prevState } = this;
    const { store } = props;
    if (store.focused) {
      return;
    }
    prevState.cardPulled = store.cardPulled;
    prevState.cardShown = store.cardShown;
    store.cardPulled = false;
    store.cardShown = false;
    store.focused = true;
  };

  @action
  private onSearchBoxClear = () => {
    this.props.store.searchText = '';
    this.querySubject.next('');
  };

  @action
  private onSearchBoxTextChanged = (value: string) => {
    this.props.store.searchText = value;
  };

  @action
  private onResultSelected = (circle: Circle) => {
    const { store } = this.props;
    store.selectedCircle = circle;
    store.focused = false;
    store.cardPulled = true;
    store.cardShown = true;
  };
}
