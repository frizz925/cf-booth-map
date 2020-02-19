import Circle from '@models/Circle';
import CircleBookmark from '@models/CircleBookmark';
import BookmarkRepository from '@repositories/BookmarkRepository';
import CircleRepository from '@repositories/CircleRepository';
import map from 'lodash/map';
import merge from 'lodash/merge';
import { BehaviorSubject, Subject } from 'rxjs';
import BookmarkObservable from 'src/observables/BookmarkObservable';

export type BookmarkHandler = (circle: Circle) => void;

interface BookmarkMap {
  [key: number]: Circle;
}

export default class SearchPresenter {
  public readonly shown = new BehaviorSubject(true);
  public readonly focused = new BehaviorSubject(false);
  public readonly circle = new BehaviorSubject<Circle | undefined>(undefined);
  public readonly action = new Subject();

  private readonly circleRepository: CircleRepository;
  private readonly bookmarkRepository: BookmarkRepository;
  private readonly bookmarkObservable: BookmarkObservable;

  constructor(
    circleRepository: CircleRepository,
    bookmarkRepository: BookmarkRepository,
    bookmarkObservable: BookmarkObservable,
  ) {
    this.circleRepository = circleRepository;
    this.bookmarkRepository = bookmarkRepository;
    this.bookmarkObservable = bookmarkObservable;
  }

  public onBookmark(handler: BookmarkHandler) {
    return this.bookmarkObservable.onAdd.subscribe(handler);
  }

  public onUnbookmark(handler: BookmarkHandler) {
    return this.bookmarkObservable.onRemove.subscribe(handler);
  }

  public focus() {
    this.focused.next(true);
  }

  public async search(query: string, callback: (circles: CircleBookmark[]) => void) {
    const bookmarkMap: BookmarkMap = {};
    (await this.bookmarkRepository.all()).forEach(circle => {
      bookmarkMap[circle.id] = circle;
    });

    const fetchId = this.circleRepository.filter(query, (circles, id) => {
      if (id !== fetchId) {
        return;
      }
      const results = map(circles, circle =>
        merge({ bookmarked: !!bookmarkMap[circle.id] } as CircleBookmark, circle),
      );
      callback(results);
    });
  }

  public select(circle: Circle) {
    this.focused.next(false);
    this.circle.next(circle);
  }

  public findCircle(slug: string) {
    return this.circleRepository.findBySlug(slug);
  }

  public bookmark(circle: Circle) {
    return this.bookmarkRepository.add(circle);
  }

  public unbookmark(circle: Circle) {
    return this.bookmarkRepository.remove(circle);
  }
}
