import CircleCard, { CircleCardStore } from '@containers/CircleCard';
import SearchForm, { SearchFormStore } from '@containers/SearchForm';
import CircleRepository from '@repositories/CircleRepository';
import { IS_DEVELOPMENT } from '@utils/Constants';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';

interface BaseStore {
  cardShown: boolean;
}

export type AppStore = BaseStore & SearchFormStore & CircleCardStore;

export interface AppContainerProps {
  store: AppStore;
  circleRepository: CircleRepository;
}

@observer
class AppContainer extends PureComponent<AppContainerProps> {
  constructor(props: AppContainerProps) {
    super(props);
  }

  public render() {
    const { store, circleRepository } = this.props;
    return (
      <div>
        <SearchForm store={store} repository={circleRepository} />
        <CircleCard store={store} />
      </div>
    );
  }
}

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
