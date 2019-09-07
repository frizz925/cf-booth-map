import * as circles from '../data/circles.json';
import parseCircles from './parseCircles';

it('should parse circles data properly', () => {
  const result = parseCircles(circles);
  expect(result[0].boothNumbers).toEqual(['A01a', 'A01b']);
});
