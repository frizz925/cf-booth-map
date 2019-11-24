import MapRenderer from './MapRenderer';

const SCALE_STEP = 0.1;
const VELOCITY_MULTIPLIER = 20.0;
const MAX_SCALE_VELOCITY = 2.0;

export default class MapController {
  private renderer: MapRenderer;

  private panState = {
    startX: 0,
    startY: 0,
    velocityX: 0,
    velocityY: 0,
  };

  private pinchState = {
    startScale: 0,
    scaleVelocity: 0,
  };

  constructor(renderer: MapRenderer) {
    this.renderer = renderer;
  }

  public onMouseWheel = (evt: WheelEvent) => {
    this.cancelAllAnimationFrames();
    const { state } = this.renderer;
    const delta = -1 * Math.sign(evt.deltaY);
    const amount = SCALE_STEP * delta;
    const scale = state.scale * (1.0 + amount);

    let scaleVelocity = MAX_SCALE_VELOCITY * delta;
    if (Math.sign(scaleVelocity) === Math.sign(state.scaleVelocity)) {
      scaleVelocity = state.scaleVelocity + scaleVelocity;
    }
    this.updateOffset(evt.clientX, evt.clientY, scale, scaleVelocity);
  };

  public onWindowResize = () => {
    this.renderer.render();
  };

  public onViewSingleTap = (evt: HammerInput) => {
    this.cancelAllAnimationFrames();
    this.updateOffset(evt.center.x, evt.center.y, this.renderer.state.scale, 0);
  };

  public onViewDoubleTap = (evt: HammerInput) => {
    this.cancelAllAnimationFrames();
    const { state } = this.renderer;
    const scale = state.scale * (1.0 + SCALE_STEP);
    const scaleVelocity = MAX_SCALE_VELOCITY;
    console.log(scale);
    this.updateOffset(evt.center.x, evt.center.y, scale, scaleVelocity);
  };

  public onViewPan = (evt: HammerInput) => {
    this.cancelAllAnimationFrames();

    const { panState, renderer } = this;
    const { state } = renderer;

    if (evt.type === 'panstart') {
      panState.startX = state.x;
      panState.startY = state.y;
      panState.velocityX = state.velocityX;
      panState.velocityY = state.velocityY;
    }

    let velocityX = 0;
    let velocityY = 0;
    if (evt.type === 'panend') {
      velocityX = (evt.velocityX * VELOCITY_MULTIPLIER) / state.scale;
      velocityY = (evt.velocityY * VELOCITY_MULTIPLIER) / state.scale;
      if (Math.sign(velocityX) === Math.sign(panState.velocityX)) {
        velocityX = panState.velocityX + velocityX;
      }
      if (Math.sign(velocityY) === Math.sign(panState.velocityY)) {
        velocityY = panState.velocityY + velocityY;
      }
    }

    renderer.updateState({
      x: panState.startX - evt.deltaX / state.scale,
      y: panState.startY - evt.deltaY / state.scale,
      velocityX,
      velocityY,
    });
  };

  public onViewPinch = (evt: HammerInput) => {
    this.cancelAllAnimationFrames();

    const { pinchState, renderer } = this;
    const { state } = renderer;

    if (evt.type === 'pinchstart') {
      pinchState.startScale = state.scale;
      pinchState.scaleVelocity = state.scaleVelocity;
    }

    let scaleVelocity = 0;
    if (evt.type === 'pinchend') {
      scaleVelocity = (evt.scale - 1.0) / (evt.deltaTime / 100);
      if (Math.sign(scaleVelocity) === Math.sign(pinchState.scaleVelocity)) {
        scaleVelocity = pinchState.scaleVelocity + scaleVelocity;
      }
    }

    const scale = pinchState.startScale * evt.scale;
    this.updateOffset(evt.center.x, evt.center.y, scale, scaleVelocity);
  };

  private updateOffset(x: number, y: number, scale: number, scaleVelocity: number) {
    const { state } = this.renderer;
    const deltaX = (x - state.offsetX - state.outerX) / state.scale;
    const deltaY = (y - state.offsetY - state.outerY) / state.scale;
    const offsetX = state.offsetX + deltaX;
    const offsetY = state.offsetY + deltaY;

    const absDeltaScale = state.scale - 1.0;
    const outerX = state.outerX + deltaX * absDeltaScale;
    const outerY = state.outerY + deltaY * absDeltaScale;

    this.renderer.updateState({
      offsetX,
      offsetY,
      outerX,
      outerY,
      scale,
      scaleVelocity,
    });
  }

  private cancelAllAnimationFrames() {
    const { state } = this.renderer;
    const { velocityRAF } = state;
    if (velocityRAF) {
      window.cancelAnimationFrame(velocityRAF);
    }
    state.velocityRAF = 0;
  }
}
