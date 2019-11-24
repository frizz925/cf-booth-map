import Circle from '@models/Circle';

export interface RawCircle {
  name: string;
  booth_number: string;
}

const parseCircle = (circle: RawCircle): Circle => {
  return {
    name: circle.name,
    boothNumber: circle.booth_number,
  };
};

export default parseCircle;
