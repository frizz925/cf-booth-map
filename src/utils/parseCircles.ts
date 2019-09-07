import Circle, { CircleData } from '@models/Circle';
import { pascalCase } from 'change-case';
import { map } from 'lodash';

export default function parseCircles(circles: CircleData[]): Circle[] {
  return circles.map((circle: CircleData): Circle => ({
    id: circle.id,
    name: circle.name,
    boothNumbers: parseBoothNumber(circle.booth_number),
    isSaturday: !!circle.isSaturday,
    isSunday: !!circle.isSunday,
  }));
}

function parseBoothNumber(boothNumber: string): string[] {
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
