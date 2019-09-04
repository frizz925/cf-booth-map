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

export interface Cell {
  prefix: string;
  number: number;
  suffix: string;
  direction: Direction;
  orientation: Orientation;
}

export interface Cluster {
  name: string;

  left: number;
  top: number;
  width: number;
  height: number;

  cells: Cell[][];
}
