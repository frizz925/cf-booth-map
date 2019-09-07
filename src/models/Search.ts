import Booth, { Cluster } from '@models/Booth';
import Circle from '@models/Circle';

export interface SearchView {
  x: number;
  y: number;
  circle?: Circle;
  booth?: Booth;
  cluster?: Cluster;
}

export type SearchViews = SearchView[];
