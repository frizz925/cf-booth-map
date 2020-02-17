import Category from './Category';
import Day from './Day';
import Social from './Social';

export default interface Circle {
  id: number;
  slug: string;
  name: string;
  imageUrl: string;
  boothNumber: string;
  boothNumbers: string[];
  rating: string;
  fandoms: string[];
  categories: Category[];
  socials: Social[];
  day: Day;
  search: string;
}
