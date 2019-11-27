import DrawerContainer from '@components/Drawer';
import CardContainer, { CardContainerStore } from '@containers/CardContainer';
import SearchContainer, { SearchFormStore } from '@containers/SearchContainer';
import CircleRepository from '@repositories/CircleRepository';
import { IS_DEVELOPMENT } from '@utils/Constants';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader/root';

interface BaseStore {
  cardShown: boolean;
  drawerShown: boolean;
}

export type AppStore = BaseStore & SearchFormStore & CardContainerStore;

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
        <DrawerContainer />
        <SearchContainer store={store} repository={circleRepository} />
        <CardContainer store={store} />
      </div>
    );
  }
}

export default IS_DEVELOPMENT ? hot(AppContainer) : AppContainer;
