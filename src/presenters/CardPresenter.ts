import Circle from '@models/Circle';
import BookmarkRepository from '@repositories/BookmarkRepository';
import { BehaviorSubject } from 'rxjs';
import BookmarkObservable from 'src/observables/BookmarkObservable';

export default class CardPresenter {
  public readonly circle = new BehaviorSubject<Circle | undefined>(undefined);
  public readonly shown = new BehaviorSubject(false);
  public readonly pulled = new BehaviorSubject(false);
  public readonly cardElement = new BehaviorSubject<Element | null>(null);

  public get circleSelected() {
    return !!this.circle;
  }

  public get onAdd() {
    return this.bookmarkObservable.onAdd;
  }

  public get onRemove() {
    return this.bookmarkObservable.onRemove;
  }

  private readonly bookmarkRepository: BookmarkRepository;
  private readonly bookmarkObservable: BookmarkObservable;
  private prevCircle?: Circle;

  constructor(
    bookmarkRepository: BookmarkRepository,
    bookmarkObservable: BookmarkObservable,
  ) {
    this.bookmarkRepository = bookmarkRepository;
    this.bookmarkObservable = bookmarkObservable;

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
    return this.bookmarkRepository.add(circle);
  }

  public unbookmark(circle: Circle) {
    return this.bookmarkRepository.remove(circle);
  }

  public isBookmarked(circle: Circle) {
    return this.bookmarkRepository.has(circle);
  }
}
