import Circle from '@models/Circle';
import parseCircle, { RawCircle } from '@models/parsers/parseCircle';
import Fuse from 'fuse.js';
import map from 'lodash/map';

export default class CircleRepository {
  private fuse: Fuse<Circle, {}>;
  private lastResults: Circle[] = [];

  public fetch(): Promise<Circle[]> {
    return import('@data/circles.json').then((circles: RawCircle[]) => {
      const results = map(circles, circle => parseCircle(circle))
        .filter(circle => {
          return !!circle.name;
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
      this.lastResults = results;
      this.updateFuse(results);
      return results;
    });
  }

  public findCircles(query: string): Circle[] {
    if (!query || !this.fuse) {
      return this.lastResults;
    }
    return this.fuse.search(query);
  }

  private updateFuse(circles: Circle[]) {
    this.fuse = new Fuse(circles, {
      shouldSort: true,
      threshold: 0.3,
      distance: 50,
      keys: ['name', 'boothNumber'],
      tokenize: true,
    });
  }
}
