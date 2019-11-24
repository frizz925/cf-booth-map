import Circle from '@models/Circle';

export interface RawCircle {
  id: number;
  name: string;
  booth_number: string;
}

const parseCircle = (circle: RawCircle): Circle => {
  return {
    id: circle.id,
    name: circle.name,
    boothNumber: circle.booth_number,
  };
};

export default parseCircle;
