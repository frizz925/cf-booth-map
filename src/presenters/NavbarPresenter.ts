import { BehaviorSubject } from 'rxjs';

export default class NavbarPresenter {
  public readonly selectedIndex = new BehaviorSubject(0);
  public readonly navbarElement = new BehaviorSubject<Element | null>(null);
  public readonly shown = new BehaviorSubject(true);
  public readonly path = new BehaviorSubject('/');

  public show() {
    this.shown.next(true);
  }

  public hide() {
    this.shown.next(false);
  }
}
