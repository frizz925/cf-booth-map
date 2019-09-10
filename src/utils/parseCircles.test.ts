import * as circles from '@data/circles.json';
import { CircleData } from '@models/Circle.js';
import parseCircles from './parseCircles';

it('should parse circles data properly', () => {
  const result = parseCircles(circles as CircleData[]);
  expect(result[0].boothNumbers).toEqual(['A01a', 'A01b']);
});
