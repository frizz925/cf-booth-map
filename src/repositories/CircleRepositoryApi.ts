import Circle from '@models/Circle';
import { RawCircle } from '@models/parsers/CircleParser';
import Parser from '@models/parsers/Parser';
import { AxiosInstance } from 'axios';
import Fuse from 'fuse.js';
import map from 'lodash/map';
import CircleRepository from './CircleRepository';

export default class CircleRepositoryApi implements CircleRepository {
  private client: AxiosInstance;
  private parser: Parser<RawCircle, Circle>;

  private fuse: Fuse<Circle, {}>;

  constructor(client: AxiosInstance, parser: Parser<RawCircle, Circle>) {
    this.client = client;
    this.parser = parser;
  }

  public async fetch(): Promise<Circle[]> {
    const res = await this.client.get('/data/circles.json');
    const circles = res.data as RawCircle[];
    const results = map(circles, circle => this.parser.parse(circle))
      .filter(circle => {
        return !!circle.name;
      })
      .sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
    this.updateFuse(results);
    return results;
  }

  public async find(query: string): Promise<Circle[]> {
    if (!query) {
      return [];
    }
    if (!this.fuse) {
      await this.fetch();
      return this.find(query);
    }
    return new Promise(resolve => {
      process.nextTick(() => {
        resolve(this.fuse.search(query));
      });
    });
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
