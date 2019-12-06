import Circle from '@models/Circle';
import localforage from 'localforage';
import BookmarkRepositoryBase from './BookmarkRepositoryBase';

const BOOKMARKS_KEY = 'bookmarks';

export default class BookmarkRepositoryStorage extends BookmarkRepositoryBase {
  public async all(): Promise<Circle[]> {
    return (await localforage.getItem<Circle[]>(BOOKMARKS_KEY)) || [];
  }

  public async has(circle: Circle): Promise<boolean> {
    const circles = await this.all();
    return circles.map(c => c.id).includes(circle.id);
  }

  protected async addInternal(circle: Circle): Promise<void> {
    const circles = await this.all();
    circles.push(circle);
    await this.update(circles);
  }

  protected async removeInternal(circle: Circle): Promise<void> {
    const bookmarks = await this.all();
    const filtered = bookmarks.filter(c => c.id !== circle.id);
    await this.update(filtered);
  }

  private async update(circles: Circle[]) {
    const stored = circles.sort((a, b) => a.boothNumber.localeCompare(b.boothNumber));
    await localforage.setItem(BOOKMARKS_KEY, stored);
  }
}
