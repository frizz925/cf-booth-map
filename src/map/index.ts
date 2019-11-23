import mapImage from '@assets/floor_map_cf13.png';
import merge from 'lodash/merge';
import { Application, Container, Graphics, Sprite } from 'pixi.js';

interface AppState {
  x: number;
  y: number;
  outerX: number;
  outerY: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  originX: number;
  originY: number;
  originScale: number;
}

const renderContainer = document.getElementById('renderer');

let appState: AppState = {
  x: 0,
  y: 0,
  outerX: 0,
  outerY: 0,
  offsetX: 0,
  offsetY: 0,
  scale: 1.1,
  originX: 0,
  originY: 0,
  originScale: 1.1,
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

  const updateContainers = (state: AppState, prevState?: AppState) => {
    if (!prevState) {
      prevState = state;
    }
    const { x, y, outerX, outerY, offsetX, offsetY, scale } = state;
    stage.position.set(x, y);
    outerContainer.position.set(outerX, outerY);

    const innerX = offsetX;
    const innerY = offsetY;
    graphics.position.set(innerX, innerY);
    innerContainer.pivot.set(innerX, innerY);
    innerContainer.position.set(innerX, innerY);
    innerContainer.scale.set(scale);
  };
  updateContainers(appState);

  const updateState = (state: Partial<AppState>) => {
    const newState = merge({}, appState, state);
    updateContainers(newState, appState);
    appState = newState;
  };

  const updateOffset = (evt: MouseEvent, delta: number, scale: number) => {
    const deltaX = delta > 0 ? (evt.clientX - appState.offsetX - appState.outerX) / appState.scale : 0;
    const deltaY = delta > 0 ? (evt.clientY - appState.offsetY - appState.outerY) / appState.scale : 0;
    const offsetX = appState.offsetX + deltaX;
    const offsetY = appState.offsetY + deltaY;

    const originScale = appState.originScale;
    const originDeltaScale = originScale - 1.0;
    const deltaScale = appState.scale - 1.0;
    const originX = appState.originX + deltaX * (deltaScale - originDeltaScale);
    const originY = appState.originY + deltaY * (deltaScale - originDeltaScale);
    const outerX = offsetX * originDeltaScale + originX;
    const outerY = offsetY * originDeltaScale + originY;

    updateState({ outerX, outerY, offsetX, offsetY, scale, originX, originY, originScale });
  };

  app.loader.add(mapImage).load(() => {
    const mapTexture = app.loader.resources[mapImage].texture;
    const mapSprite = new Sprite(mapTexture);
    innerContainer.addChildAt(mapSprite, 0);
  });

  window.addEventListener('wheel', (evt: WheelEvent) => {
    const delta = -1 * Math.sign(evt.deltaY);
    const amount = 0.1 * delta;
    const scale = appState.scale * (1.0 + amount);
    updateOffset(evt, delta, scale);
  });

  window.addEventListener('click', (evt: MouseEvent) => {
    updateOffset(evt, 1, appState.scale);
  });

  renderContainer.appendChild(app.view);
};

window.addEventListener('load', initApp);
