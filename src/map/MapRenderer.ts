import { IS_DEVELOPMENT, IS_PRODUCTION } from '@utils/Constants';
import each from 'lodash/each';
import merge from 'lodash/merge';
import range from 'lodash/range';
import { Application, Container, Graphics, Sprite, utils } from 'pixi.js';

const IMAGE_BASE_URL = '/assets/map';
const IMAGE_NAME_PREFIX = 'floor_map_cf14';
const IMAGE_CHUNK_WIDTH = 2048;
const IMAGE_CHUNK_HEIGHT = 2048;
const IMAGE_CHUNK_ROWS = 4;
const IMAGE_CHUNK_COLUMNS = 5;

const getMapImages = (webpSupported: boolean) => {
  const type = webpSupported ? 'webp' : 'png';
  const result: string[][] = [];
  each(range(IMAGE_CHUNK_ROWS), row => {
    const rowResult: string[] = [];
    each(range(IMAGE_CHUNK_COLUMNS), col => {
      const filename = `${IMAGE_NAME_PREFIX}-${row}-${col}.${type}`;
      rowResult.push(`${IMAGE_BASE_URL}/${type}/${filename}`);
    });
    result.push(rowResult);
  });
  return result;
};

if (IS_PRODUCTION) {
  utils.skipHello();
}

const SCALE_EASE_STEP = 0.04;
const VELOCITY_FRICTION = 0.92;
const VELOCITY_SCALE_FRICTION = 0.88;

export interface AppState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  velocityRAF?: number;
  outerX: number;
  outerY: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  scaleVelocity: number;
  zoomToggle: boolean;
}

export default class MapRenderer {
  public state: AppState = {
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    outerX: 0,
    outerY: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1.0,
    scaleVelocity: 0,
    zoomToggle: false,
  };

  private mapImages: string[][];

  private outerContainer: Container;
  private innerContainer: Container;
  private pointer?: Graphics;

  private app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    backgroundColor: 0xffffff,
  });

  constructor(webpSupported: boolean) {
    this.mapImages = getMapImages(webpSupported);
    this.app.ticker.autoStart = false;
    this.app.ticker.stop();
    this.initContainers();
  }

  public attach(container: Element) {
    container.appendChild(this.app.view);
    this.render();
    this.initTextures();
  }

  public updateState(state: Partial<AppState>) {
    this.state = merge(this.state, state);
    this.update();
  }

  public update() {
    this.cancelAllAnimationFrames();

    const { innerContainer, outerContainer, pointer, state } = this;
    const {
      x,
      y,
      velocityX,
      velocityY,
      outerX,
      outerY,
      offsetX,
      offsetY,
      scale,
      scaleVelocity,
    } = state;

    const absOffsetX = offsetX + x;
    const absOffsetY = offsetY + y;
    innerContainer.pivot.set(absOffsetX, absOffsetY);
    innerContainer.position.set(absOffsetX, absOffsetY);
    innerContainer.scale.set(scale);

    if (IS_DEVELOPMENT) {
      pointer.position.set(absOffsetX, absOffsetY);
    }

    const absOuterX = outerX - x;
    const absOuterY = outerY - y;
    outerContainer.position.set(absOuterX, absOuterY);

    if (
      Math.abs(velocityX) > 1e-3 ||
      Math.abs(velocityY) > 1e-3 ||
      Math.abs(scaleVelocity) > 1e-3
    ) {
      const newVelocityX = velocityX * VELOCITY_FRICTION;
      const newVelocityY = velocityY * VELOCITY_FRICTION;
      const newScaleVelocity = scaleVelocity * VELOCITY_SCALE_FRICTION;
      const newScale = scale * (1.0 + SCALE_EASE_STEP * newScaleVelocity);
      state.velocityRAF = window.requestAnimationFrame(() => {
        this.updateState({
          x: x - newVelocityX,
          y: y - newVelocityY,
          velocityX: newVelocityX,
          velocityY: newVelocityY,
          scale: newScale,
          scaleVelocity: newScaleVelocity,
        });
      });
    }

    this.render();
  }

  public render() {
    this.app.render();
  }

  private initContainers() {
    const stage = this.app.stage;
    this.outerContainer = new Container();
    stage.addChild(this.outerContainer);

    this.innerContainer = new Container();
    this.outerContainer.addChildAt(this.innerContainer, 0);

    if (IS_DEVELOPMENT) {
      this.pointer = new Graphics();
      this.pointer.beginFill(0xff0000).drawCircle(0, 0, 5);
      this.innerContainer.addChild(this.pointer);
    }
  }

  private initTextures() {
    each(this.mapImages, (mapImages, row) => {
      each(mapImages, (mapImage, col) => {
        this.app.loader
          .add(mapImage)
          .once('complete', () => this.initTexture(mapImage, row, col));
      });
    });
    this.app.loader.load(() => {
      this.updateState({ x: 256, y: 0, scale: 0.4 });
    });
  }

  private initTexture(image: string, row: number, col: number) {
    const mapTexture = this.app.loader.resources[image].texture;
    const mapSprite = new Sprite(mapTexture);
    mapSprite.x = IMAGE_CHUNK_WIDTH * col;
    mapSprite.y = IMAGE_CHUNK_HEIGHT * row;
    this.innerContainer.addChildAt(mapSprite, 0);
  }

  private cancelAllAnimationFrames() {
    const { velocityRAF } = this.state;
    if (velocityRAF) {
      window.cancelAnimationFrame(velocityRAF);
    }
    this.state.velocityRAF = 0;
  }
}
