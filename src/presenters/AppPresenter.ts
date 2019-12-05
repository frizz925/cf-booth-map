import CardPresenter from './CardPresenter';
import DrawerPresenter from './DrawerPresenter';
import SearchPresenter from './SearchPresenter';

export default class AppPresenter {
  public readonly cardPresenter: CardPresenter;
  public readonly drawerPresenter: DrawerPresenter;
  public readonly searchPresenter: SearchPresenter;

  private readonly prevState = {
    cardShown: false,
    cardPulled: false,
    drawerOpened: false,
    searchFocused: false,
  };

  constructor(
    cardPresenter: CardPresenter,
    drawerPresenter: DrawerPresenter,
    searchPresenter: SearchPresenter,
  ) {
    this.cardPresenter = cardPresenter;
    this.drawerPresenter = drawerPresenter;
    this.searchPresenter = searchPresenter;
    this.saveState();
    this.subscribePresenters();
  }

  private subscribePresenters() {
    const { cardPresenter, drawerPresenter, searchPresenter, prevState } = this;

    cardPresenter.pulled.subscribe(pulled => {
      if (pulled) {
        this.saveState();
        drawerPresenter.opened.next(false);
        searchPresenter.focused.next(false);
      } else if (prevState.cardPulled) {
        drawerPresenter.opened.next(prevState.drawerOpened);
        searchPresenter.focused.next(prevState.searchFocused);
      }
    });

    drawerPresenter.opened.subscribe(opened => {
      if (opened) {
        this.saveState();
        cardPresenter.pulled.next(false);
        searchPresenter.focused.next(false);
      } else if (prevState.drawerOpened) {
        cardPresenter.pulled.next(prevState.cardPulled);
        searchPresenter.focused.next(prevState.searchFocused);
      }
    });

    searchPresenter.focused.subscribe(focused => {
      if (focused) {
        this.saveState();
        cardPresenter.pulled.next(false);
        cardPresenter.shown.next(false);
        drawerPresenter.opened.next(false);
      } else if (prevState.searchFocused) {
        cardPresenter.shown.next(prevState.cardShown);
        cardPresenter.pulled.next(prevState.cardPulled);
        drawerPresenter.opened.next(prevState.drawerOpened);
      }
    });

    searchPresenter.action.subscribe(() => drawerPresenter.opened.next(true));
    searchPresenter.circle.subscribe(circle => cardPresenter.circle.next(circle));
  }

  private saveState() {
    const { cardPresenter, drawerPresenter, searchPresenter, prevState } = this;
    prevState.cardShown = cardPresenter.shown.value;
    prevState.cardPulled = cardPresenter.pulled.value;
    prevState.drawerOpened = drawerPresenter.opened.value;
    prevState.searchFocused = searchPresenter.focused.value;
  }
}
