import * as circles from '../data/circles.json';
import * as mapping from '../data/mapping.json';
import mapCircleBooth from './mapCircleBooth';
import parseBoothMap from './parseBoothMap';
import parseCircles from './parseCircles';

it('should map circles with their booths correctly', () => {
  const result = mapCircleBooth(
    parseBoothMap(mapping),
    parseCircles(circles),
  );
  expect(Object.keys(result.byBooths).length).toBeGreaterThan(0);
  expect(Object.keys(result.byCircles).length).toBeGreaterThan(0);
});
