import Circle from '@models/Circle';

export default interface CircleRepository {
  fetch(): Promise<Circle[]>;
  find(query: string): Promise<Circle[]>;
}
