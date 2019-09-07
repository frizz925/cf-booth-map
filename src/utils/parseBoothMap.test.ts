import * as boothMapData from '../data/mapping.json';
import parseBoothMap from './parseBoothMap';

it('should parse booth map correctly', () => {
  const result = parseBoothMap(boothMapData);
  expect(result.length).toBeGreaterThan(0);
  const lastResult = result[result.length - 1];
  expect(lastResult.name).toBe('A');
  const booths = lastResult.booths;
  expect(booths.length).toBeGreaterThan(0);
  expect(booths[0].length).toBeGreaterThan(0);
  expect(booths[0][0].prefix).toBe(lastResult.name);
  expect(booths[0][0].number).toBe(8);
});
