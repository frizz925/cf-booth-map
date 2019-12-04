import { BehaviorSubject } from 'rxjs';

export default class DrawerPresenter {
  public readonly opened = new BehaviorSubject(false);
}
