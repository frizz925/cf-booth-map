import mapImagePng from '@assets/floor_map_cf13.png';
import mapImageWebp from '@assets/floor_map_cf13.webp';
import AppContext from '@models/AppContext';
import Hammer from 'hammerjs';
import MapController from './MapController';
import MapRenderer from './MapRenderer';

const setupRenderer = (context: AppContext, stage: Element, renderer: MapRenderer) => {
  renderer.attach(stage);

  const controller = new MapController(renderer);
  window.addEventListener('resize', controller.onWindowResize);
  window.addEventListener('wheel', evt => {
    if (!context.mapDisabled) {
      controller.onMouseWheel(evt);
    }
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
};

const Map = (context: AppContext, stage: Element) => {
  Modernizr.on('webp', result => {
    const mapImage = result ? mapImageWebp : mapImagePng;
    setupRenderer(context, stage, new MapRenderer(mapImage));
  });
};

export default Map;
