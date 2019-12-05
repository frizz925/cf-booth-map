import Circle from '@models/Circle';
import { BehaviorSubject } from 'rxjs';

export default class CardPresenter {
  public readonly circle = new BehaviorSubject<Circle | undefined>(undefined);
  public readonly shown = new BehaviorSubject(false);
  public readonly pulled = new BehaviorSubject(false);

  public get circleSelected() {
    return !!this.circle;
  }

  private prevCircle?: Circle;

  constructor() {
    this.circle.subscribe(circle => {
      if (circle) {
        this.prevCircle = circle;
        this.pull();
      } else if (this.prevCircle) {
        this.hide();
        this.prevCircle = null;
      }
    });
  }

  public pull() {
    if (this.circleSelected) {
      this.shown.next(true);
      this.pulled.next(true);
    } else {
      this.hide();
    }
  }

  public tab() {
    if (this.circleSelected) {
      this.shown.next(true);
      this.pulled.next(false);
    } else {
      this.hide();
    }
  }

  public hide() {
    this.shown.next(false);
    this.pulled.next(false);
  }
}
