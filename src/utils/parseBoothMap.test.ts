import * as boothMapData from '../data/mapping.json';
import parseBoothMap from './parseBoothMap';

it('should parse booth map correctly', () => {
  const result = parseBoothMap(boothMapData);
  console.log(JSON.stringify(result, null, 2));
});
