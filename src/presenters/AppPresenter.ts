import { CIRCLE_PATH_PREFIX } from '@utils/Routing';
import CardPresenter from './CardPresenter';
import DrawerPresenter from './DrawerPresenter';
import PagePresenter from './PagePresenter';
import SearchPresenter from './SearchPresenter';

export default class AppPresenter {
  public readonly pagePresenter: PagePresenter;
  public readonly cardPresenter: CardPresenter;
  public readonly drawerPresenter: DrawerPresenter;
  public readonly searchPresenter: SearchPresenter;

  private readonly prevState = {
    pageOpened: false,
    cardShown: false,
    cardPulled: false,
    drawerOpened: false,
    searchFocused: false,
  };

  constructor(
    pagePresenter: PagePresenter,
    cardPresenter: CardPresenter,
    drawerPresenter: DrawerPresenter,
    searchPresenter: SearchPresenter,
  ) {
    this.pagePresenter = pagePresenter;
    this.cardPresenter = cardPresenter;
    this.drawerPresenter = drawerPresenter;
    this.searchPresenter = searchPresenter;
    this.saveState();
    this.subscribePresenters();
  }

  private subscribePresenters() {
    const {
      pagePresenter,
      cardPresenter,
      drawerPresenter,
      searchPresenter,
      prevState,
    } = this;

    pagePresenter.opened.subscribe(opened => {
      if (opened) {
        this.saveState();
        cardPresenter.pulled.next(false);
        cardPresenter.shown.next(false);
        drawerPresenter.opened.next(false);
        searchPresenter.focused.next(false);
        searchPresenter.shown.next(false);
      } else if (prevState.pageOpened) {
        searchPresenter.shown.next(true);
        cardPresenter.shown.next(prevState.cardShown);
      }
    });

    pagePresenter.path.subscribe(path => {
      if (!path.startsWith(CIRCLE_PATH_PREFIX)) {
        cardPresenter.hide();
        return;
      }
      const slug = path.substring(CIRCLE_PATH_PREFIX.length);
      searchPresenter.findCircle(slug).then(value => {
        searchPresenter.select(value);
      });
    });

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

    pagePresenter.circle.subscribe(cardPresenter.circle);
    searchPresenter.circle.subscribe(cardPresenter.circle);
  }

  private saveState() {
    const {
      pagePresenter,
      cardPresenter,
      drawerPresenter,
      searchPresenter,
      prevState,
    } = this;
    prevState.pageOpened = pagePresenter.opened.value;
    prevState.cardShown = cardPresenter.shown.value;
    prevState.cardPulled = cardPresenter.pulled.value;
    prevState.drawerOpened = drawerPresenter.opened.value;
    prevState.searchFocused = searchPresenter.focused.value;
  }
}
