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

class AppContainer extends PureComponent<AppContainerProps> {
  @observable
  private searchStore: SearchFormStore = {
    focused: false,
    searchText: '',
  };

  constructor(props: AppContainerProps) {
    super(props);
    autorun(() => {
      props.context.mapDisabled = this.searchStore.focused;
    });
  }

  public render() {
    const { props, searchStore } = this;
    const { circleRepository } = props;
    return <SearchForm store={searchStore} repository={circleRepository} />;
  }
}

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
