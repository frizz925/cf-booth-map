import Circle from '@models/Circle';
import { History } from 'history';
import { IS_PRODUCTION } from './Constants';

export const USE_BROWSER_ROUTER = IS_PRODUCTION;
export const CIRCLE_PATH_PREFIX = '/c/';

export const pushIndex = (history: History) => {
  process.nextTick(() => history.push('/'));
};

export const pushCircle = (history: History, circle: Circle) => {
  process.nextTick(() => history.push(getCirclePath(circle)));
};

export const getCirclePath = (circle: Circle) => {
  return `${CIRCLE_PATH_PREFIX}${circle.slug}`;
};
