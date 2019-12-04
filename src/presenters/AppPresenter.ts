import { filter } from 'rxjs/operators';
import CardPresenter from './CardPresenter';
import DrawerPresenter from './DrawerPresenter';
import SearchPresenter from './SearchPresenter';

export default class AppPresenter {
  public readonly cardPresenter: CardPresenter;
  public readonly drawerPresenter: DrawerPresenter;
  public readonly searchPresenter: SearchPresenter;

  constructor(
    cardPresenter: CardPresenter,
    drawerPresenter: DrawerPresenter,
    searchPresenter: SearchPresenter,
  ) {
    this.cardPresenter = cardPresenter;
    this.drawerPresenter = drawerPresenter;
    this.searchPresenter = searchPresenter;

    cardPresenter.pulled.pipe(filter(Boolean)).subscribe(() => {
      drawerPresenter.opened.next(false);
      searchPresenter.focused.next(false);
    });

    drawerPresenter.opened.pipe(filter(Boolean)).subscribe(() => {
      cardPresenter.pulled.next(false);
      searchPresenter.focused.next(false);
    });

    searchPresenter.focused.pipe(filter(Boolean)).subscribe(() => {
      cardPresenter.pulled.next(false);
      drawerPresenter.opened.next(false);
    });
    searchPresenter.action.subscribe(() => {
      searchPresenter.focused.next(false);
      cardPresenter.pulled.next(false);
      drawerPresenter.opened.next(true);
    });
    searchPresenter.circle.subscribe(circle => cardPresenter.circle.next(circle));
  }
}
