import { CIRCLE_PATH_PREFIX } from '@utils/Routing';
import BookmarkObservable from 'src/observables/BookmarkObservable';
import CardPresenter from './CardPresenter';
import DrawerPresenter from './DrawerPresenter';
import PagePresenter from './PagePresenter';
import SearchPresenter from './SearchPresenter';
import SnackbarPresenter from './SnackbarPresenter';

export default class AppPresenter {
  public readonly pagePresenter: PagePresenter;
  public readonly cardPresenter: CardPresenter;
  public readonly drawerPresenter: DrawerPresenter;
  public readonly searchPresenter: SearchPresenter;
  public readonly snackbarPresenter: SnackbarPresenter;

  private readonly bookmarkObservable: BookmarkObservable;

  private readonly prevState = {
    pageOpened: false,
    cardShown: false,
    cardPulled: false,
    drawerOpened: false,
    searchFocused: false,
  };

  constructor(
    bookmarkObservable: BookmarkObservable,
    pagePresenter: PagePresenter,
    cardPresenter: CardPresenter,
    drawerPresenter: DrawerPresenter,
    searchPresenter: SearchPresenter,
    snackbarPresenter: SnackbarPresenter,
  ) {
    this.bookmarkObservable = bookmarkObservable;
    this.pagePresenter = pagePresenter;
    this.cardPresenter = cardPresenter;
    this.drawerPresenter = drawerPresenter;
    this.searchPresenter = searchPresenter;
    this.snackbarPresenter = snackbarPresenter;
    this.saveState();
    this.subscribeObservables();
    this.subscribePresenters();
  }

  public confirm(message: string) {
    return this.snackbarPresenter.confirm(message);
  }

  public snackbar(message: string) {
    return this.snackbarPresenter.show(message);
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
      drawerPresenter,
      searchPresenter,
      prevState,
    } = this;

    pagePresenter.opened.subscribe(opened => {
      if (opened) {
        this.saveState();
        cardPresenter.hide();
        drawerPresenter.close();
        searchPresenter.hide();
      } else if (prevState.pageOpened) {
        searchPresenter.show();
        cardPresenter.shown.next(prevState.cardShown);
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
    });

    cardPresenter.pulled.subscribe(pulled => {
      if (pulled) {
        this.saveState();
        drawerPresenter.close();
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
        cardPresenter.hide();
        drawerPresenter.close();
      } else if (prevState.searchFocused) {
        cardPresenter.shown.next(prevState.cardShown);
        cardPresenter.pulled.next(prevState.cardPulled);
        drawerPresenter.opened.next(prevState.drawerOpened);
      }
    });

    searchPresenter.action.subscribe(() => drawerPresenter.open());

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
