import AppPresenter from '@presenters/AppPresenter';
import Hammer from 'hammerjs';
import MapController from './MapController';
import MapRenderer from './MapRenderer';

const setupRenderer = (
  renderer: MapRenderer,
  controller: MapController,
  stage: Element,
) => {
  window.addEventListener('resize', controller.onWindowResize);
  stage.addEventListener('wheel', (evt: WheelEvent) => controller.onMouseWheel(evt), {
    passive: true,
  });

  const mc = new Hammer.Manager(stage);

  const singleTap = new Hammer.Tap({ event: 'singletap', taps: 1 });
  const doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
  const pan = new Hammer.Pan({ threshold: 0, pointers: 0 });

  mc.add(doubleTap);
  mc.add(singleTap).requireFailure(doubleTap);

  mc.add(pan);
  mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(pan);

  mc.on('singletap', controller.onViewSingleTap);
  mc.on('doubletap', controller.onViewDoubleTap);
  mc.on('panstart panmove panend', controller.onViewPan);
  mc.on('pinchstart pinchmove pinchend', controller.onViewPinch);

  renderer.attach(stage);
};

const map = (presenter: AppPresenter, stage: Element) => {
  Modernizr.on('webp', result => {
    const renderer = new MapRenderer(result);
    const controller = new MapController(presenter, renderer);
    setupRenderer(renderer, controller, stage);
  });
};

export default map;
