import { CIRCLE_PATH_PREFIX } from '@utils/Routing';
import { BehaviorSubject } from 'rxjs';
import BookmarkObservable from 'src/observables/BookmarkObservable';
import CardPresenter from './CardPresenter';
import NavbarPresenter from './NavbarPresenter';
import PagePresenter from './PagePresenter';
import SearchPresenter from './SearchPresenter';
import SnackbarPresenter from './SnackbarPresenter';

export default class AppPresenter {
  public readonly shown = new BehaviorSubject(true);

  public readonly pagePresenter: PagePresenter;
  public readonly cardPresenter: CardPresenter;
  public readonly navbarPresenter: NavbarPresenter;
  public readonly searchPresenter: SearchPresenter;
  public readonly snackbarPresenter: SnackbarPresenter;

  private readonly bookmarkObservable: BookmarkObservable;

  private readonly prevState = {
    uiShown: true,
    pageOpened: false,
    cardShown: false,
    cardPulled: false,
    searchShown: true,
    searchFocused: false,
    navbarShown: true,
  };

  constructor(
    bookmarkObservable: BookmarkObservable,
    pagePresenter: PagePresenter,
    cardPresenter: CardPresenter,
    navbarPresenter: NavbarPresenter,
    searchPresenter: SearchPresenter,
    snackbarPresenter: SnackbarPresenter,
  ) {
    this.bookmarkObservable = bookmarkObservable;
    this.pagePresenter = pagePresenter;
    this.cardPresenter = cardPresenter;
    this.navbarPresenter = navbarPresenter;
    this.searchPresenter = searchPresenter;
    this.snackbarPresenter = snackbarPresenter;
    this.saveState();
    this.subscribeObservables();
    this.subscribePresenters();
  }

  public confirm(message: string, action?: string) {
    return this.snackbarPresenter.confirm(message, action);
  }

  public snackbar(message: string, action?: string) {
    return this.snackbarPresenter.show(message, action);
  }

  public toggleUi() {
    this.shown.next(!this.shown.value);
  }

  private subscribeObservables() {
    this.bookmarkObservable.onAdd.subscribe(({ name }) => {
      this.snackbar(`${name} added to favorites`);
    });
    this.bookmarkObservable.onRemove.subscribe(({ name }) => {
      this.snackbar(`${name} removed from favorites`);
    });
  }

  private subscribePresenters() {
    const {
      pagePresenter,
      cardPresenter,
      searchPresenter,
      navbarPresenter,
      prevState,
    } = this;

    this.shown.subscribe(shown => {
      if (!shown && prevState.uiShown) {
        this.saveState();
        cardPresenter.pulled.next(false);
        cardPresenter.shown.next(false);
        searchPresenter.focused.next(false);
        searchPresenter.shown.next(false);
        navbarPresenter.shown.next(false);
      } else if (shown && !prevState.uiShown) {
        cardPresenter.pulled.next(prevState.cardPulled);
        cardPresenter.shown.next(prevState.cardShown);
        searchPresenter.focused.next(prevState.searchFocused);
        searchPresenter.shown.next(prevState.searchShown);
        navbarPresenter.shown.next(prevState.navbarShown);
        this.saveState();
      }
    });

    pagePresenter.opened.subscribe(opened => {
      if (opened && !prevState.pageOpened) {
        this.saveState();
        cardPresenter.shown.next(false);
      } else if (!opened && prevState.pageOpened) {
        cardPresenter.shown.next(prevState.cardShown);
        this.saveState();
      }
    });

    pagePresenter.path.subscribe(path => {
      if (!path.startsWith(CIRCLE_PATH_PREFIX)) {
        if (cardPresenter.shown.value) {
          cardPresenter.pulled.next(false);
        }
        return;
      }
      const slug = path.substring(CIRCLE_PATH_PREFIX.length);
      searchPresenter.findCircle(slug).then(value => {
        searchPresenter.select(value);
      });
      navbarPresenter.path.next(path);
    });

    cardPresenter.pulled.subscribe(pulled => {
      if (pulled && !prevState.cardPulled) {
        this.saveState();
        searchPresenter.focused.next(false);
      } else if (!pulled && prevState.cardPulled) {
        searchPresenter.focused.next(prevState.searchFocused);
        this.saveState();
      }
    });

    searchPresenter.focused.subscribe(focused => {
      if (focused && !prevState.searchFocused) {
        this.saveState();
        cardPresenter.hide();
        navbarPresenter.hide();
      } else if (!focused && prevState.searchFocused) {
        cardPresenter.shown.next(prevState.cardShown);
        cardPresenter.pulled.next(prevState.cardPulled);
        navbarPresenter.shown.next(prevState.navbarShown);
        this.saveState();
      }
    });

    pagePresenter.circle.subscribe(cardPresenter.circle);
    searchPresenter.circle.subscribe(cardPresenter.circle);
  }

  private saveState(...presenters: any[]) {
    const {
      pagePresenter,
      cardPresenter,
      searchPresenter,
      navbarPresenter,
      prevState,
    } = this;
    if (presenters.length <= 0) {
      presenters = [this, pagePresenter, cardPresenter, searchPresenter, navbarPresenter];
    }
    presenters.forEach(presenter => {
      switch (true) {
        case presenter === this:
          prevState.uiShown = this.shown.value;
          break;
        case presenter === pagePresenter:
          prevState.pageOpened = pagePresenter.opened.value;
          break;
        case presenter === cardPresenter:
          prevState.cardShown = cardPresenter.shown.value;
          prevState.cardPulled = cardPresenter.pulled.value;
          break;
        case presenter === searchPresenter:
          prevState.searchShown = searchPresenter.shown.value;
          prevState.searchFocused = searchPresenter.focused.value;
          break;
        case presenter === navbarPresenter:
          prevState.navbarShown = navbarPresenter.shown.value;
          break;
      }
    });
  }
}
