import CardContainer, { CardContainerStore } from '@containers/CardContainer';
import DrawerContainer, { DrawerContainerStore } from '@containers/DrawerContainer';
import SearchContainer, { SearchContainerStore } from '@containers/SearchContainer';
import CircleRepository from '@repositories/CircleRepository';
import { IS_DEVELOPMENT } from '@utils/Constants';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';

interface BaseStore {
  cardShown: boolean;
}

export type AppStore = BaseStore &
  DrawerContainerStore &
  SearchContainerStore &
  CardContainerStore;

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
        <DrawerContainer store={store} />
        <SearchContainer store={store} repository={circleRepository} />
        <CardContainer store={store} />
      </div>
    );
  }
}

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
