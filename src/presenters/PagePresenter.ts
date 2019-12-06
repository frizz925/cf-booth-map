import Circle from '@models/Circle';
import { BehaviorSubject, Subject } from 'rxjs';

export default class PagePresenter {
  public readonly circle = new Subject<Circle>();
  public readonly opened = new BehaviorSubject(false);
}
