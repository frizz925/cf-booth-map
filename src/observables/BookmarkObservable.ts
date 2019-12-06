import Circle from '@models/Circle';
import { Observable } from 'rxjs';

export default interface BookmarkObservable {
  onAdd: Observable<Circle>;
  onRemove: Observable<Circle>;
}
