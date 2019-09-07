import Circle, { CircleData, Work, workMap } from '@models/Circle';
import { CATALOG_BASE_URL } from '@utils/const';
import { pascalCase } from 'change-case';
import { map } from 'lodash';

export default function parseCircles(circles: CircleData[]): Circle[] {
  return circles.map((circle: CircleData): Circle => ({
    id: circle.id,
    name: circle.name,
    boothNumber: circle.booth_number,
    boothNumbers: parseBoothNumbers(circle.booth_number),
    isSaturday: !!circle.isSaturday,
    isSunday: !!circle.isSunday,

    imageUrl: CATALOG_BASE_URL + circle.src,
    fandoms: circle.fandom.split(', '),
    rating: circle.rating,
    works: parseCircleWorks(circle),

    socialMedia: {
      facebook: optional(circle.circle_facebook),
      twitter: optional(circle.circle_twitter),
      instagram: optional(circle.circle_instagram),
    },
    sample: optional(circle.sample),
  }));
}

function optional(text: string): string|undefined {
  return text !== '-' ? text : undefined;
}

function parseBoothNumbers(boothNumber: string): string[] {
  return boothNumber.split('/').reduce((curry, boothToken) => {
    const [firstToken] = boothToken.split(' ');
    const [prefix, rest] = firstToken.split('-');
    const middle = rest.substring(0, 2);
    if (rest.length <= 2) {
      curry.push(pascalCase(prefix) + middle);
      return curry;
    }
    return curry.concat(map(rest.substring(2), (suffix) => {
      return pascalCase(prefix) + middle + suffix;
    }));
  }, []);
}

function parseCircleWorks(data: CircleData): Work[] {
  return map(workMap, (work: Work, key: string) => {
    return data[key] ? work : null;
  }).filter((x) => !!x);
}
