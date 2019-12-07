import Circle from '@models/Circle';
import Day from '@models/Day';

export const details = ({ day, boothNumber }: Circle) => {
  if (day === Day.Both) {
    return boothNumber;
  }
  return `${boothNumber}, ${day}`;
};
