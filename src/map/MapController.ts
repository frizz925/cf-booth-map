import MapRenderer from './MapRenderer';

const SCALE_STEP = 0.1;
const VELOCITY_MULTIPLIER = 20.0;
const MAX_SCALE_VELOCITY = 2.0;

export default class MapController {
  private renderer: MapRenderer;

  private panState = {
    startX: 0,
    startY: 0,
  };

  private pinchState = {
    startScale: 0,
  };

  constructor(renderer: MapRenderer) {
    this.renderer = renderer;
  }

  public onMouseWheel = (evt: WheelEvent) => {
    evt.preventDefault();
    this.cancelAllAnimationFrames();
    const { state } = this.renderer;
    const delta = -1 * Math.sign(evt.deltaY);
    const amount = SCALE_STEP * delta;
    const scale = state.scale * (1.0 + amount);
    this.updateOffset(evt.clientX, evt.clientY, delta, scale, MAX_SCALE_VELOCITY * delta);
  };

  public onMouseClick = (evt: MouseEvent) => {
    this.cancelAllAnimationFrames();
    this.updateOffset(evt.clientX, evt.clientY, 0, this.renderer.state.scale, 0);
  };

  public onWindowResize = () => {
    this.renderer.render();
  };

  public onViewPan = (evt: HammerInput) => {
    this.cancelAllAnimationFrames();

    const { panState, renderer } = this;
    const { state } = renderer;

    if (evt.type === 'panstart') {
      panState.startX = state.x;
      panState.startY = state.y;
    }

    let velocityX = 0;
    let velocityY = 0;
    if (evt.type === 'panend') {
      velocityX = (evt.velocityX * VELOCITY_MULTIPLIER) / state.scale;
      velocityY = (evt.velocityY * VELOCITY_MULTIPLIER) / state.scale;
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
    }

    let scaleVelocity = 0;
    if (evt.type === 'pinchend') {
      scaleVelocity = (evt.scale - 1.0) / (evt.deltaTime / 100);
    }

    const delta = Math.sign(evt.scale);
    const scale = pinchState.startScale * evt.scale;
    this.updateOffset(evt.center.x, evt.center.y, delta, scale, scaleVelocity);
  };

  private updateOffset(
    x: number,
    y: number,
    delta: number,
    scale: number,
    scaleVelocity: number,
  ) {
    const { state } = this.renderer;
    const deltaX = delta >= 0 ? (x - state.offsetX - state.outerX) / state.scale : 0;
    const deltaY = delta >= 0 ? (y - state.offsetY - state.outerY) / state.scale : 0;
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
