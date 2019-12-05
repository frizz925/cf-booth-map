import { BehaviorSubject } from 'rxjs';

export default class PagePresenter {
  public readonly opened = new BehaviorSubject(false);
}
