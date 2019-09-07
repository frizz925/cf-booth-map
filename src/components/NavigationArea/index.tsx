import { SearchView } from '@models/Search';
import { clearSearchView } from '@store/app/actions';
import { AppState } from '@store/app/types';
import Hammer from 'hammerjs';
import { assign } from 'lodash';
import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import Transformable from './Transformable';

const SCALE_WHEEL_MULTIPLIER = 0.0015;

interface BaseProps {
  children: ReactNode;
}

interface StateToProps {
  searchView?: SearchView;
  isSearching: boolean;
}

interface DispatchToProps {
  clearSearchView: () => void;
}

type NavigationAreaProps = BaseProps & StateToProps & DispatchToProps;

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

class NavigationArea extends Component<NavigationAreaProps, NavigationAreaState> {
  private containerRef = React.createRef<HTMLDivElement>();
  private registeredListeners: ListenerRegistration[] = [];
  private mc: HammerManager;

  private startState: NavigationAreaState;
  constructor(props: NavigationAreaProps) {
    super(props);
    this.state = {
      x: -1200,
      y: -1200,
      z: 0,
      scale: 1.0,
      angle: 0.0,
    };
    this.startState = this.state;
  }

  public componentDidMount() {
    this.mc = this.setupHammer();
    this.registerListeners();
    this.maybeHandleSearchView();
  }

  public componentDidUpdate() {
    this.maybeHandleSearchView();
  }

  public componentWillUnmount() {
    this.unregisterListeners();
  }

  public render() {
    return (
      <Container ref={this.containerRef}>
        <Transformable {...this.state}>
          {this.props.children}
        </Transformable>
      </Container>
    );
  }

  protected updateState(newState: NavigationAreaState) {
    this.setState(assign({}, this.state, newState));
  }

  private maybeHandleSearchView() {
    if (!this.props.isSearching || !this.props.searchView) {
      return;
    }
    const searchView = this.props.searchView;
    this.props.clearSearchView();

    const clientRect = this.containerRef.current.getBoundingClientRect();
    const { scale } = this.state;
    const centerX = (clientRect.left + (clientRect.width / 2)) / scale;
    const centerY = (clientRect.top + (clientRect.height / 2)) / scale;
    this.updatePosition(
      this.state.x - (searchView.x / scale) + centerX,
      this.state.y - (searchView.y / scale) + centerY,
    );
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
    }, { passive: true });

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

  private registerNativeListener(eventType: string, listener: EventListener, options?: AddEventListenerOptions) {
    this.registerListener(EventManager.Native, eventType, listener, options);
  }

  private registerHammerListener(eventType: string, listener: HammerListener) {
    this.registerListener(EventManager.Hammer, eventType, listener);
  }

  private registerListener(eventManager: EventManager,
                           eventType: string,
                           listener: RegisteredListener,
                           options?: AddEventListenerOptions) {
    if (eventManager === EventManager.Hammer) {
      this.mc.on(eventType, listener as HammerListener);
    } else if (eventManager === EventManager.Native) {
      this.containerRef.current.addEventListener(eventType, listener as EventListener, options);
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
        this.containerRef.current.removeEventListener(
          reg.eventType,
          reg.listener as EventListener,
        );
      } else {
        this.mc.off(reg.eventType, reg.listener as HammerListener);
      }
    });
  }
}

const mapStateToProps = (state: AppState): StateToProps => ({
  searchView: state.searchView,
  isSearching: state.isSearching,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  clearSearchView() {
    dispatch(clearSearchView());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationArea);
