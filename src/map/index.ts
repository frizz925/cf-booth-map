import Hammer from 'hammerjs';
import MapController from './MapController';
import MapRenderer from './MapRenderer';

const setupRenderer = (stage: Element, renderer: MapRenderer) => {
  const controller = new MapController(renderer);
  window.addEventListener('resize', controller.onWindowResize);
  stage.addEventListener('wheel', evt => controller.onMouseWheel(evt as WheelEvent), {
    passive: true,
  });

  const mc = new Hammer.Manager(stage);

  const singleTap = new Hammer.Tap({ event: 'singletap', taps: 1 });
  const doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
  const pan = new Hammer.Pan({ threshold: 0, pointers: 0 });

  mc.add([doubleTap, singleTap, pan]);
  mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(pan);

  mc.on('singletap', controller.onViewSingleTap);
  mc.on('doubletap', controller.onViewDoubleTap);
  mc.on('panstart panmove panend', controller.onViewPan);
  mc.on('pinchstart pinchmove pinchend', controller.onViewPinch);

  renderer.attach(stage);
};

const map = (stage: Element) => {
  Modernizr.on('webp', result => {
    setupRenderer(stage, new MapRenderer(result));
  });
};

export default map;
