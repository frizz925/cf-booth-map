import SearchForm from '@components/SearchForm';
import Circle from '@models/Circle';
import CircleRepository from '@repositories/CircleRepository';
import { action, autorun, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import { Subject, Subscription } from 'rxjs';
import { CardContainerStore } from './CardContainer';
import { DrawerContainerStore } from './DrawerContainer';

interface BaseStore {
  focused: boolean;
  searching: boolean;
  searchText: string;
}

export type SearchContainerStore = BaseStore & CardContainerStore & DrawerContainerStore;

export interface SearchContainerProps {
  store: SearchContainerStore;
  repository: CircleRepository;
}

interface SearchContainerState {
  circles: Circle[];
}

@observer
export default class SearchContainer extends PureComponent<
  SearchContainerProps,
  SearchContainerState
> {
  public state = {
    circles: [] as Circle[],
  };

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
      store.searching = true;
      repository.find(query).then(
        circles => {
          this.updateCircles(circles);
          store.searching = false;
        },
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
    const { props, state } = this;
    const { circles } = state;
    const { focused, searching, searchText } = props.store;
    return (
      <SearchForm
        circles={circles}
        focused={focused}
        searching={searching}
        searchText={searchText}
        onFocus={this.onFocus}
        onAction={this.onAction}
        onBack={this.onBack}
        onClear={this.onClear}
        onTextChanged={this.onTextChanged}
        onResultSelected={this.onResultSelected}
      />
    );
  }

  private updateCircles(circles: Circle[]) {
    this.setState({ circles });
  }

  @action
  private onFocus = () => {
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
  private onAction = () => {
    this.props.store.drawerOpened = true;
  };

  @action
  private onBack = () => {
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
  private onClear = () => {
    this.props.store.searchText = '';
    this.querySubject.next('');
  };

  @action
  private onTextChanged = (value: string) => {
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
