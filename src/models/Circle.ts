export default interface Circle {
  id: number;
  name: string;
  boothNumbers: string[];
  isSaturday: boolean;
  isSunday: boolean;
}

export interface CircleData {
  id: number;
  name: string;
  booth_number: string;
  isSaturday: number;
  isSunday: number;
}
