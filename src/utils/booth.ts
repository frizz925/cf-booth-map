import Booth from '@models/Booth';
import { range } from 'lodash';

export default function getBoothNumber(booth: Booth) {
  return booth.prefix + zeropad(booth.number, 2) + (booth.suffix || '');
}

export function zeropad(value: number, pad: number) {
  const result = range(pad).map(() => '0').join() + value;
  return result.substring(result.length - pad);
}
