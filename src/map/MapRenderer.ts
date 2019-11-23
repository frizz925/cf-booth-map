import { IS_DEVELOPMENT } from '@utils/Constants';
import merge from 'lodash/merge';
import { Application, Container, Graphics, Sprite } from 'pixi.js';

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
  };

  private mapImage: string;

  private outerContainer: Container;
  private innerContainer: Container;
  private pointer?: Graphics;

  private app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    backgroundColor: 0xffffff,
  });

  constructor(mapImage: string) {
    this.mapImage = mapImage;
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
    this.app.loader.add(this.mapImage).load(() => {
      const mapTexture = this.app.loader.resources[this.mapImage].texture;
      const mapSprite = new Sprite(mapTexture);
      this.innerContainer.addChildAt(mapSprite, 0);
      this.updateState({
        x: mapSprite.width / 2 - window.innerWidth / 2,
        y: mapSprite.height / 2 - window.innerHeight / 2,
      });
    });
  }
}
