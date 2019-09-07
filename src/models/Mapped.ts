import Booth, { Cluster } from './Booth';
import Circle from './Circle';

export interface MappedCircle extends Circle {
  cluster: Cluster;
  booth: Booth;
}

export interface CircleMapping {
  [key: string]: MappedCircle;
}

export interface MappedBooth extends Booth {
  cluster: Cluster;
  circle: Circle;
}

export interface BoothMapping {
  [key: string]: MappedBooth;
}
