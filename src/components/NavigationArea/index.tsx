import Hammer from 'hammerjs';
import { assign } from 'lodash';
import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import Transformable from './Transformable';

const SCALE_WHEEL_MULTIPLIER = 0.0015;

interface NavigationAreaProps {
  children: ReactNode;
}

interface NavigationAreaState {
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  angle?: number;
}

enum EventManager {
  Hammer, Native,
}

type RegisteredListener = HammerListener|EventListener;

interface ListenerRegistration {
  eventManager: EventManager;
  eventType: string;
  listener: RegisteredListener;
}

const Container = styled.div`
position: absolute;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
overflow: hidden;
z-index: -1;
`;

export default class NavigationArea extends Component<NavigationAreaProps, NavigationAreaState> {
  private containerRef = React.createRef<HTMLDivElement>();
  private registeredListeners: ListenerRegistration[] = [];
  private mc: HammerManager;

  private startState: NavigationAreaState;
  constructor(props: NavigationAreaProps) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      z: 0,
      scale: 0.6,
      angle: 0.0,
    };
    this.startState = this.state;
  }

  public componentDidMount() {
    this.mc = this.setupHammer();
    this.registerListeners();
  }

  public componentWillUnmount() {
    this.unregisterListeners();
  }

  public render() {
    return (
      <Container ref={this.containerRef}>
        <Transformable {...this.state} style={{ pointerEvents: 'none' }}>
          {this.props.children}
        </Transformable>
      </Container>
    );
  }

  protected updateState(newState: NavigationAreaState) {
    this.setState(assign({}, this.state, newState));
  }

  private setupHammer(): HammerManager {
    const mc = new Hammer.Manager(this.containerRef.current);
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
    return mc;
  }

  private registerListeners() {
    this.registerNativeListener('wheel', (evt: WheelEvent) => {
      this.multiplyScale(1.0 - (evt.deltaY * SCALE_WHEEL_MULTIPLIER));
    });

    this.registerHammerListener('pinchstart pinchmove', (evt: HammerInput) => {
      if (evt.type === 'pinchstart') {
        this.startState = assign(this.startState, {
          scale: this.state.scale,
        });
      }
      this.updateScale(this.startState.scale * evt.scale);
    });

    this.registerHammerListener('panstart panmove', (evt: HammerInput) => {
      if (evt.type === 'panstart') {
        this.startState = assign(this.startState, {
          x: this.state.x,
          y: this.state.y,
        });
      }
      this.updatePosition(
        this.startState.x + (evt.deltaX / this.state.scale),
        this.startState.y + (evt.deltaY / this.state.scale),
      );
    });
  }

  private multiplyScale(multiplier: number) {
    this.updateState({
      scale: this.state.scale * multiplier,
    });
  }

  private updateScale(scale: number) {
    this.updateState({ scale });
  }

  private updatePosition(x: number, y: number) {
    this.updateState({ x, y });
  }

  private registerNativeListener(eventType: string, listener: EventListener) {
    this.registerListener(EventManager.Native, eventType, listener);
  }

  private registerHammerListener(eventType: string, listener: HammerListener) {
    this.registerListener(EventManager.Hammer, eventType, listener);
  }

  private registerListener(eventManager: EventManager, eventType: string, listener: RegisteredListener) {
    if (eventManager === EventManager.Hammer) {
      this.mc.on(eventType, listener as HammerListener);
    } else if (eventManager === EventManager.Native) {
      this.containerRef.current.addEventListener(eventType, listener as EventListener);
    } else {
      throw new Error(`Unknown eventManager ${eventManager}`);
    }
    this.registeredListeners.push({
      eventManager,
      eventType,
      listener,
    });
  }

  private unregisterListeners() {
    this.registeredListeners.forEach((reg) => {
      if (reg.eventManager === EventManager.Native) {
        this.containerRef.current.removeEventListener(reg.eventType, reg.listener as EventListener);
      } else {
        this.mc.off(reg.eventType, reg.listener as HammerListener);
      }
    });
  }
}
