import Circle from '@models/Circle';

export type ResultCallback = (circles: Circle[], id: number, chunk: number) => void;

export default interface CircleRepository {
  fetch(callback: ResultCallback): number;
  filter(query: string, callback: ResultCallback): number;
  findBySlug(slug: string): Promise<Circle | undefined>;
}
