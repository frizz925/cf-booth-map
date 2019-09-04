export interface Cell {
  prefix: string;
  number: number;
  suffix: string;
}

export interface Cluster {
  name: string;

  left: number;
  top: number;
  width?: number;
  height?: number;
  right?: number;
  bottom?: number;

  cells: Cell[][];
}
