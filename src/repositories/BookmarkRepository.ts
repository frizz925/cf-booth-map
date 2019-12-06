import Circle from '@models/Circle';

export default interface BookmarkRepository {
  all(): Promise<Circle[]>;
  add(circle: Circle): Promise<void>;
  remove(circle: Circle): Promise<void>;
  has(circle: Circle): Promise<boolean>;
}
