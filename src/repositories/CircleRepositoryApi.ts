import Circle from '@models/Circle';
import { RawCircle } from '@models/parsers/CircleParser';
import Parser from '@models/parsers/Parser';
import { AxiosInstance } from 'axios';
import Fuse from 'fuse.js';
import map from 'lodash/map';
import CircleRepository from './CircleRepository';

type Circles = Circle[];
type FetchTask = (circles: Circles) => void;

interface SlugIndex {
  [key: string]: Circle;
}

export default class CircleRepositoryApi implements CircleRepository {
  private readonly client: AxiosInstance;
  private readonly parser: Parser<RawCircle, Circle>;
  private readonly queue: FetchTask[] = [];

  private fuse: Fuse<Circle, {}>;
  private slugIndex: SlugIndex = {};
  private lastResults: Circles | undefined;

  constructor(client: AxiosInstance, parser: Parser<RawCircle, Circle>) {
    this.client = client;
    this.parser = parser;
  }

  public fetch(): Promise<Circles> {
    const firstTask = this.queue.length <= 0;
    const promise = new Promise<Circles>(resolve => {
      this.queue.push(resolve);
    });

    if (!firstTask) {
      return promise;
    }

    process.nextTick(async () => {
      const res = await this.client.get('/api/circles.json');
      const circles = res.data as RawCircle[];
      const results = map(circles, circle => this.parser.parse(circle))
        .filter(circle => {
          return !!circle.name;
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
      this.updateResults(results);
      this.queue.forEach(resolve => resolve(results));
      this.queue.length = 0;
    });

    return promise;
  }

  public async filter(query: string): Promise<Circles> {
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

  private async withResults<T>(cb: (circles: Circles) => Promise<T>): Promise<T> {
    if (!this.lastResults) {
      return cb(await this.fetch());
    }
    return cb(this.lastResults);
  }

  private updateResults(circles: Circles) {
    this.lastResults = circles;
    this.updateFuse(circles);
    this.updateIndex(circles);
  }

  private updateFuse(circles: Circles) {
    this.fuse = new Fuse(circles, {
      shouldSort: true,
      threshold: 0.3,
      distance: 50,
      keys: ['name', 'boothNumber'],
      tokenize: true,
    });
  }

  private updateIndex(circles: Circles) {
    const newIndex: SlugIndex = {};
    circles.forEach(circle => {
      newIndex[circle.slug] = circle;
    });
    this.slugIndex = newIndex;
  }
}
