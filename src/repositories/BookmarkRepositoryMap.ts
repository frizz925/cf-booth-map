import Circle from '@models/Circle';
import BookmarkRepositoryBase from './BookmarkRepositoryBase';

interface Bookmarks {
  [key: number]: Circle;
}

export default class BookmarkRepositoryMap extends BookmarkRepositoryBase {
  private readonly bookmarks: Bookmarks = {};

  public async all(): Promise<Circle[]> {
    return Object.values(this.bookmarks);
  }

  public async has(circle: Circle): Promise<boolean> {
    return !!this.bookmarks[circle.id];
  }

  protected async addInternal(circle: Circle): Promise<void> {
    this.bookmarks[circle.id] = circle;
  }

  protected async removeInternal(circle: Circle): Promise<void> {
    if (await this.has(circle)) {
      delete this.bookmarks[circle.id];
    }
  }
}
