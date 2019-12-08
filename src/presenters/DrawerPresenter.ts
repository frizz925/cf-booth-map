import { BehaviorSubject } from 'rxjs';

export default class DrawerPresenter {
  public readonly opened = new BehaviorSubject(false);

  public open() {
    this.opened.next(true);
  }

  public close() {
    this.opened.next(false);
  }
}
