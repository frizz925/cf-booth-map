import Circle from '@models/Circle';
import { RawCircle } from '@models/parsers/CircleParser';
import Parser from '@models/parsers/Parser';
import { AxiosInstance } from 'axios';
import Fuse from 'fuse.js';
import map from 'lodash/map';
import CircleRepository from './CircleRepository';

interface SlugIndex {
  [key: string]: Circle;
}

export default class CircleRepositoryApi implements CircleRepository {
  private client: AxiosInstance;
  private parser: Parser<RawCircle, Circle>;

  private lastResults: Circle[] | undefined;
  private fuse: Fuse<Circle, {}>;
  private slugIndex: SlugIndex = {};

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
    this.updateResults(results);
    return results;
  }

  public async filter(query: string): Promise<Circle[]> {
    if (!query) {
      return [];
    }
    return this.withResults(() => {
      return Promise.resolve(this.fuse.search(query));
    });
  }

  public async findBySlug(slug: string): Promise<Circle | undefined> {
    if (!slug) {
      return null;
    }
    return this.withResults(() => {
      return Promise.resolve(this.slugIndex[slug]);
    });
  }

  private async withResults<T>(cb: (circles: Circle[]) => Promise<T>): Promise<T> {
    if (!this.lastResults) {
      return cb(await this.fetch());
    }
    return cb(this.lastResults);
  }

  private updateResults(circles: Circle[]) {
    this.updateFuse(circles);
    this.updateIndex(circles);
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

  private updateIndex(circles: Circle[]) {
    const newIndex: SlugIndex = {};
    circles.forEach(circle => {
      newIndex[circle.slug] = circle;
    });
    this.slugIndex = newIndex;
  }
}
