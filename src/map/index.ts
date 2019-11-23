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
  window.addEventListener('click', controller.onMouseClick);
  window.addEventListener('resize', controller.onWindowResize);

  const mc = new Hammer.Manager(stage);
  mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
  mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(mc.get('pan'));

  mc.on('panstart panmove panend', controller.onViewPan);
  mc.on('pinchstart pinchmove pinchend', controller.onViewPinch);
});
