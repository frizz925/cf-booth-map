import { IS_PRODUCTION } from './Constants';

export const isIphoneXAppMode = (() => {
  if (navigator.userAgent.indexOf('iPhone') < 0) {
    return false;
  }
  if (IS_PRODUCTION) {
    if (!('standalone' in window.navigator)) {
      return false;
    }
    const standalone: boolean = (window.navigator as any).standalone;
    if (!standalone) {
      return false;
    }
  }
  const ratio = parseFloat((window.screen.width / window.screen.height).toPrecision(2));
  return ratio === 0.46;
})();
