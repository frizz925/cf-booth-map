import Circle from '@models/Circle';
import { History } from 'history';

export const CIRCLE_PATH_PREFIX = '/circle/';

export const pushCircle = (history: History, circle: Circle) => {
  history.push(getCirclePath(circle));
};

export const getCirclePath = (circle: Circle) => {
  return `${CIRCLE_PATH_PREFIX}${circle.slug}`;
};
