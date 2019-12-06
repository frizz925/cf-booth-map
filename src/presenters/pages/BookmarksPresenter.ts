import Circle from '@models/Circle';
import BookmarkRepository from '@repositories/BookmarkRepository';
import { Subject } from 'rxjs';
import BookmarkObservable from 'src/observables/BookmarkObservable';

export default class BookmarksPresenter {
  public readonly circle = new Subject<Circle>();

  public get onAdd() {
    return this.observable.onAdd;
  }

  public get onRemove() {
    return this.observable.onRemove;
  }

  private readonly repository: BookmarkRepository;
  private readonly observable: BookmarkObservable;

  constructor(repository: BookmarkRepository, observable: BookmarkObservable) {
    this.repository = repository;
    this.observable = observable;
  }

  public getAllBookmarks() {
    return this.repository.all();
  }

  public removeBookmark(circle: Circle) {
    return this.repository.remove(circle);
  }
}
