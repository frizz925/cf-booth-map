import mapImage from '@assets/floor_map_cf13.png';
import merge from 'lodash/merge';
import { Application, Container, Graphics, Sprite } from 'pixi.js';

const SCALE_STEP = 0.04;
const SCALE_EASE_STEP = 0.03;
const VELOCITY_FRICTION = 0.84;
const MAX_VELOCITY = 1.0;

interface AppState {
  x: number;
  y: number;
  outerX: number;
  outerY: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  scaleVelocity: number;
  scaleVelocityRAF?: number;
}

const renderContainer = document.getElementById('renderer');

const appState: AppState = {
  x: 0,
  y: 0,
  outerX: 0,
  outerY: 0,
  offsetX: 0,
  offsetY: 0,
  scale: 1.3,
  scaleVelocity: 0,
};

const initApp = () => {
  const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: true,
    autoDensity: true,
    resizeTo: renderContainer,
  });

  const stage = app.stage;
  const outerContainer = new Container();
  stage.addChild(outerContainer);

  const innerContainer = new Container();
  outerContainer.addChildAt(innerContainer, 0);

  const graphics = new Graphics();
  graphics.beginFill(0xff0000).drawRect(-5, -5, 10, 10);
  innerContainer.addChild(graphics);

  const updateContainers = (state: AppState) => {
    const { x, y, outerX, outerY, offsetX, offsetY, scale, scaleVelocity } = state;
    innerContainer.pivot.set(offsetX, offsetY);
    innerContainer.position.set(offsetX, offsetY);
    innerContainer.scale.set(scale);
    graphics.position.set(offsetX, offsetY);
    outerContainer.position.set(outerX, outerY);
    stage.position.set(x, y);

    if (Math.abs(scaleVelocity) <= 1e-3) {
      return;
    }
    appState.scaleVelocityRAF = window.requestAnimationFrame(() => {
      const newScaleVelocity = scaleVelocity * VELOCITY_FRICTION;
      const newScale = scale * (1.0 + SCALE_EASE_STEP * newScaleVelocity);
      console.log(scaleVelocity, newScaleVelocity, scale, newScale);
      updateState({
        scale: newScale,
        scaleVelocity: newScaleVelocity,
      });
    });
  };
  updateContainers(appState);

  const updateState = (state: Partial<AppState>) => {
    updateContainers(merge(appState, state));
  };

  const updateOffset = (evt: MouseEvent, delta: number, scale: number) => {
    const deltaX =
      delta >= 0 ? (evt.clientX - appState.offsetX - appState.outerX) / scale : 0;
    const deltaY =
      delta >= 0 ? (evt.clientY - appState.offsetY - appState.outerY) / scale : 0;
    const offsetX = appState.offsetX + deltaX;
    const offsetY = appState.offsetY + deltaY;

    const absDeltaScale = scale - 1.0;
    const deltaScale = scale - appState.scale;
    const outerX = appState.outerX + deltaX * absDeltaScale - deltaX * deltaScale;
    const outerY = appState.outerY + deltaY * absDeltaScale - deltaY * deltaScale;

    const scaleVelocity =
      Math.sign(appState.scaleVelocity * deltaScale) > 0
        ? (delta > 0 ? Math.min : Math.max)(
            appState.scaleVelocity + deltaScale,
            MAX_VELOCITY * delta,
          )
        : deltaScale;
    const scaleVelocityRAF = appState.scaleVelocityRAF;
    if (scaleVelocityRAF) {
      window.cancelAnimationFrame(scaleVelocityRAF);
    }

    updateState({
      offsetX,
      offsetY,
      outerX,
      outerY,
      scale,
      scaleVelocity,
      scaleVelocityRAF: 0,
    });
  };

  app.loader.add(mapImage).load(() => {
    const mapTexture = app.loader.resources[mapImage].texture;
    const mapSprite = new Sprite(mapTexture);
    innerContainer.addChildAt(mapSprite, 0);
  });

  window.addEventListener('wheel', (evt: WheelEvent) => {
    const delta = -1 * Math.sign(evt.deltaY);
    const amount = SCALE_STEP * delta;
    const scale = appState.scale * (1.0 + amount);
    updateOffset(evt, delta, scale);
  });

  window.addEventListener('click', (evt: MouseEvent) => {
    updateOffset(evt, 1, appState.scale);
  });

  renderContainer.appendChild(app.view);
};

window.addEventListener('load', initApp);
