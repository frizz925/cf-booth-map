import { CIRCLE_PATH_PREFIX } from '@utils/Routing';
import BookmarkObservable from 'src/observables/BookmarkObservable';
import CardPresenter from './CardPresenter';
import NavbarPresenter from './NavbarPresenter';
import PagePresenter from './PagePresenter';
import SearchPresenter from './SearchPresenter';
import SnackbarPresenter from './SnackbarPresenter';

export default class AppPresenter {
  public readonly pagePresenter: PagePresenter;
  public readonly cardPresenter: CardPresenter;
  public readonly navbarPresenter: NavbarPresenter;
  public readonly searchPresenter: SearchPresenter;
  public readonly snackbarPresenter: SnackbarPresenter;

  private readonly bookmarkObservable: BookmarkObservable;

  private readonly prevState = {
    pageOpened: false,
    cardShown: false,
    cardPulled: false,
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

  private subscribeObservables() {
    this.bookmarkObservable.onAdd.subscribe(({ name }) => {
      this.snackbar(`${name} added to bookmarks`);
    });
    this.bookmarkObservable.onRemove.subscribe(({ name }) => {
      this.snackbar(`${name} removed from bookmarks`);
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

    pagePresenter.opened.subscribe(opened => {
      if (opened && !prevState.pageOpened) {
        this.saveState();
        cardPresenter.hide();
      } else if (!opened && prevState.pageOpened) {
        cardPresenter.shown.next(prevState.cardShown);
        this.saveState();
      }
    });

    pagePresenter.path.subscribe(path => {
      if (!path.startsWith(CIRCLE_PATH_PREFIX)) {
        cardPresenter.pulled.next(false);
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

  private saveState() {
    const {
      pagePresenter,
      cardPresenter,
      searchPresenter,
      navbarPresenter,
      prevState,
    } = this;
    prevState.pageOpened = pagePresenter.opened.value;
    prevState.cardShown = cardPresenter.shown.value;
    prevState.cardPulled = cardPresenter.pulled.value;
    prevState.searchFocused = searchPresenter.focused.value;
    prevState.navbarShown = navbarPresenter.shown.value;
  }
}
