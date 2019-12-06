import Circle from '@models/Circle';
import BookmarkRepository from '@repositories/BookmarkRepository';
import { BehaviorSubject } from 'rxjs';
import BookmarkObservable from 'src/observables/BookmarkObservable';

export default class CardPresenter {
  public readonly circle = new BehaviorSubject<Circle | undefined>(undefined);
  public readonly shown = new BehaviorSubject(false);
  public readonly pulled = new BehaviorSubject(false);

  public get circleSelected() {
    return !!this.circle;
  }

  public get onAdd() {
    return this.observable.onAdd;
  }

  public get onRemove() {
    return this.observable.onRemove;
  }

  private readonly repository: BookmarkRepository;
  private readonly observable: BookmarkObservable;
  private prevCircle?: Circle;

  constructor(repository: BookmarkRepository, observable: BookmarkObservable) {
    this.repository = repository;
    this.observable = observable;

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

  public bookmark(circle: Circle) {
    return this.repository.add(circle);
  }

  public unbookmark(circle: Circle) {
    return this.repository.remove(circle);
  }

  public isBookmarked(circle: Circle) {
    return this.repository.has(circle);
  }
}
