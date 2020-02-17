import { BehaviorSubject } from 'rxjs';

export default class NavbarPresenter {
  public readonly selectedIndex = new BehaviorSubject(0);
}
