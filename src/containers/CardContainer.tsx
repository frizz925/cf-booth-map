import CircleCard from '@components/CircleCard';
import Circle from '@models/Circle';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import React, { PureComponent } from 'react';

export interface CardContainerStore {
  cardShown: boolean;
  cardPulled: boolean;
  selectedCircle?: Circle;
}

export interface CardContainerProps {
  store: CardContainerStore;
}

@observer
export default class CardContainer extends PureComponent<CardContainerProps> {
  public render() {
    const { selectedCircle, cardShown, cardPulled } = this.props.store;
    return (
      <CircleCard
        circle={selectedCircle}
        shown={cardShown}
        pulled={cardPulled}
        onOverlayClick={this.onOverlayClick}
        onCardPulled={this.onCardPulled}
        onCardHidden={this.onCardHidden}
        onCardTabbed={this.onCardTabbed}
      />
    );
  }

  @action
  private onOverlayClick = () => {
    const { store } = this.props;
    store.cardPulled = false;
  };

  @action
  private onCardPulled = () => {
    const { store } = this.props;
    store.cardShown = true;
    store.cardPulled = true;
  };

  @action
  private onCardHidden = () => {
    const { store } = this.props;
    store.cardPulled = false;
    store.cardShown = false;
  };

  @action
  private onCardTabbed = () => {
    const { store } = this.props;
    store.cardShown = true;
    store.cardPulled = false;
  };
}
