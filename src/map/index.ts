import mapImage from '@assets/floor_map_cf13.png';
import Hammer from 'hammerjs';
import MapController from './MapController';
import MapRenderer from './MapRenderer';

window.addEventListener('load', () => {
  const stage = document.getElementById('stage');
  const renderer = new MapRenderer(mapImage);
  renderer.attach(stage);

  const controller = new MapController(renderer);
  window.addEventListener('wheel', controller.onMouseWheel);
  window.addEventListener('resize', controller.onWindowResize);

  const mc = new Hammer.Manager(stage);

  const singleTap = new Hammer.Tap({ event: 'singletap', taps: 1 });
  const doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
  const pan = new Hammer.Pan({ threshold: 0, pointers: 0 });

  mc.add([doubleTap, singleTap, pan]);
  mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(pan);

  doubleTap.recognizeWith(singleTap);
  singleTap.requireFailure(doubleTap);

  mc.on('singletap', controller.onViewSingleTap);
  mc.on('doubletap', controller.onViewDoubleTap);
  mc.on('panstart panmove panend', controller.onViewPan);
  mc.on('pinchstart pinchmove pinchend', controller.onViewPinch);
});
