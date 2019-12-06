import Circle from '@models/Circle';
import { Subject } from 'rxjs';
import BookmarkObservable from 'src/observables/BookmarkObservable';
import BookmarkRepository from './BookmarkRepository';

export default abstract class BookmarkRepositoryBase
  implements BookmarkRepository, BookmarkObservable {
  public readonly onAdd = new Subject<Circle>();
  public readonly onRemove = new Subject<Circle>();

  public abstract all(): Promise<Circle[]>;
  public abstract has(circle: Circle): Promise<boolean>;

  public async add(circle: Circle) {
    await this.addInternal(circle);
    this.onAdd.next(circle);
  }

  public async remove(circle: Circle) {
    await this.removeInternal(circle);
    this.onRemove.next(circle);
  }

  protected abstract addInternal(circle: Circle): Promise<void>;
  protected abstract removeInternal(circle: Circle): Promise<void>;
}
