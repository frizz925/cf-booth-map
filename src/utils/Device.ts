import { IS_PRODUCTION } from './Constants';

export const isIphone = navigator.userAgent.indexOf('iPhone') >= 0;

export const isFullscreen = (() => {
  if (IS_PRODUCTION) {
    if ('standalone' in window.navigator) {
      const standalone: boolean = (window.navigator as any).standalone;
      if (standalone) {
        return true;
      }
    }
    return (
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches
    );
  }
  return true;
})();

export const isIphoneXAppMode = (() => {
  if (!isIphone || !isFullscreen) {
    return false;
  }
  const ratio = parseFloat((window.screen.width / window.screen.height).toPrecision(2));
  return ratio === 0.46;
})();
