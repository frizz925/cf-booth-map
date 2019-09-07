export enum Direction {
  Up,
  Right,
  Down,
  Left,
}

export enum Orientation {
  Horizontal,
  Vertical,
}

export interface MarkedBooths {
  [key: string]: boolean;
}

export default interface Booth {
  prefix: string;
  number: number;
  suffix?: string;
  direction?: Direction;
  orientation?: Orientation;
}

export interface Cluster {
  name: string;

  left: number;
  top: number;
  width: number;
  height: number;

  booths: Booth[][];
}

export interface ClusterData {
  cluster?: string;
  clusterRange?: string;
  clusterDirection?: string;
  clusterGap?: {
    top: number;
    left: number;
  };

  orientation: string;
  direction?: string;

  top: number;
  left: number;
  right: number;
  bottom: number;

  range: string;
  suffixes?: string;
}
