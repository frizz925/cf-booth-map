import Circle from '@models/Circle';
import { RawCircle } from '@models/parsers/CircleParser';
import Parser from '@models/parsers/Parser';
import { AxiosInstance } from 'axios';
import Fuse from 'fuse.js';
import map from 'lodash/map';
import range from 'lodash/range';
import CircleRepository, { ResultCallback } from './CircleRepository';

const CIRCLE_CHUNKS = 13;

type Circles = Circle[];
type CircleFuse = Fuse<Circle, {}>;

interface SlugIndex {
  [key: string]: Circle;
}

interface ResultsIndex {
  [key: number]: {
    circles: Circles;
    fuse: CircleFuse;
  };
}

export default class CircleRepositoryApi implements CircleRepository {
  private readonly client: AxiosInstance;
  private readonly parser: Parser<RawCircle, Circle>;

  private slugIndex: SlugIndex = {};
  private resultsIndex: ResultsIndex = {};

  private lastId = 0;

  constructor(client: AxiosInstance, parser: Parser<RawCircle, Circle>) {
    this.client = client;
    this.parser = parser;
  }

  public fetch(callback: ResultCallback): number {
    const fetchId = ++this.lastId;
    range(CIRCLE_CHUNKS).forEach(async chunk => {
      const circles = await this.fetchChunk(chunk);
      callback(circles, fetchId, chunk);
    });
    return fetchId;
  }

  public async fetchChunk(chunk: number): Promise<Circles> {
    if (this.resultsIndex[chunk]) {
      return this.resultsIndex[chunk].circles;
    }
    const res = await this.client.get(`/api/circles-${chunk}.json`);
    const circles = map(res.data as RawCircle[], circle => this.parser.parse(circle))
      .filter(circle => !!circle.name)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
    this.updateResults(chunk, circles);
    return circles;
  }

  public filter(query: string, callback: ResultCallback): number {
    if (!query) {
      return this.lastId;
    }
    return this.fetch((_, id, chunk) => {
      if (this.lastId !== id) {
        return;
      }
      const fuse = this.resultsIndex[chunk].fuse;
      process.nextTick(() => {
        callback(fuse.search(query), id, chunk);
      });
    });
  }

  public async findBySlug(slug: string): Promise<Circle | undefined> {
    if (!slug) {
      return null;
    }
    await Promise.all(map(range(CIRCLE_CHUNKS), chunk => this.fetchChunk(chunk)));
    return this.slugIndex[slug];
  }

  private updateResults(chunk: number, circles: Circles) {
    const fuse = new Fuse(circles, {
      shouldSort: true,
      threshold: 0.2,
      distance: 30,
      keys: ['search', 'name', 'boothNumber'],
      tokenize: true,
      caseSensitive: false,
    });
    this.resultsIndex[chunk] = { circles, fuse };
    this.updateIndex(circles);
  }

  private updateIndex(circles: Circles) {
    circles.forEach(circle => {
      this.slugIndex[circle.slug] = circle;
    });
  }
}
