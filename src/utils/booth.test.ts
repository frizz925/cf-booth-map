import getBoothNumber from './booth';

it('should format into proper booth number', () => {
  expect(getBoothNumber({
    prefix: 'A',
    number: 1,
    suffix: 'a',
  })).toBe('A01a');

  expect(getBoothNumber({
    prefix: 'Aa',
    number: 1,
  })).toBe('Aa01');
});
