import CircleCard from '@containers/CircleCard';
import SearchForm, { SearchFormStore } from '@containers/SearchForm';
import AppContext from '@models/AppContext';
import CircleRepository from '@repositories/CircleRepository';
import { IS_DEVELOPMENT } from '@utils/Constants';
import { autorun, observable } from 'mobx';
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';

interface AppContainerProps {
  context: AppContext;
  circleRepository: CircleRepository;
}

interface BaseStore {
  cardShown: boolean;
}

type AppStore = BaseStore & SearchFormStore;

class AppContainer extends PureComponent<AppContainerProps> {
  @observable
  private store: AppStore = {
    cardShown: true,
    focused: false,
    searchText: '',
  };

  constructor(props: AppContainerProps) {
    super(props);
    autorun(() => {
      props.context.mapDisabled = this.store.focused || this.store.cardShown;
    });
  }

  public render() {
    const { props, store } = this;
    const { circleRepository } = props;
    const { cardShown: shown } = store;
    return (
      <div>
        <SearchForm store={store} repository={circleRepository} />
        <CircleCard store={store} shown={shown} />
      </div>
    );
  }
}

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
