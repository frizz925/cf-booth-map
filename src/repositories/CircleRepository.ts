import Circle from '@models/Circle';

export default interface CircleRepository {
  fetch(): Promise<Circle[]>;
  filter(query: string): Promise<Circle[]>;
  findBySlug(slug: string): Promise<Circle | undefined>;
}
