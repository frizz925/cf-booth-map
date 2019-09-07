import Booth from '@models/Booth';
import Circle from '@models/Circle';
import { SearchView } from '@models/Search';
import { pushSearchView } from '@store/app/actions';
import { AppState } from '@store/app/types';
import getBoothNumber from '@utils/booth';
import CSS from 'csstype';
import React, { PureComponent, ReactNode } from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Subject } from 'rxjs';
import styled from 'styled-components';

interface BaseProps {
  boothNumber: string;
  booth: Booth;
  circle: Circle;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  children?: ReactNode;
  style?: CSS.Properties;
}

interface StateToProps {
  displayCircleName: boolean;
  isMarked: boolean;
  isSearching: boolean;
}

interface DispatchToProps {
  pushSearchView: (searchView: SearchView) => void;
}

type ClusterBoothProps = BaseProps & StateToProps & DispatchToProps;

interface ClusterBoothState {
  isHovered: boolean;
}

export interface EventData {
  circle: Circle;
  booth: Booth;
}

const Cell = styled.td`
background-color: #fff;
text-align: center;
font-size: 9pt;
overflow: hidden;
margin: 0;
padding: 0;
`;

const BackgroundContainer = styled.div`
display: table;
position: relative;
width: 100%;
height: 100%;
`;

const Background = styled.div`
background-size: cover;
background-position: 50% 50%;
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
opacity: 0.15;
z-index: 0;
`;

const MarkedBackground = styled(Background)`
background-color: #1875d1;
opacity: 0;
transition: opacity 0.5s;
z-index: 1;
`;

const Content = styled.div`
display: table-cell;
position: relative;
vertical-align: middle;
transition: color 0.3s;
overflow-wrap: break-word;
z-index: 2;
`;

interface Job {
  el: HTMLDivElement;
  imageUrl: string;
}

const counter = {
  value: 0,
  running: false,
};
const queue: Job[] = [];
const runQueue = () => {
  if (counter.running) {
    return;
  }
  counter.running = true;

   // Load up to 2 images at the same time
  while (counter.value < 2) {
    const job = queue.shift();
    if (!job) {
      counter.running = false;
      return;
    }

    const { el, imageUrl } = job;
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url(${imageUrl})`;
      counter.value--;
      process.nextTick(runQueue);
    };
    img.src = imageUrl;
    if (img.complete) {
      img.onload(null);
    }

    counter.value++;
  }

  counter.running = false;
};

class ClusterBooth extends PureComponent<ClusterBoothProps, ClusterBoothState> {
  private ref = React.createRef<HTMLTableCellElement>();
  private bgRef = React.createRef<HTMLDivElement>();

  private inHandler: (evt: MouseEvent) => void;
  private outHandler: (evt: MouseEvent) => void;

  private observer: IntersectionObserver;

  constructor(props: ClusterBoothProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
    this.inHandler = () => {
      this.setState({ isHovered: true });
    };
    this.outHandler = () => {
      this.setState({ isHovered: false });
    };

    this.observer = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        this.observer.disconnect();
        const { circle } = this.props;
        queue.push({
          el: this.bgRef.current,
          imageUrl: circle.imageUrl,
        });
        runQueue();
      }
    });
  }

  public componentDidMount() {
    this.maybeTriggerPanning();
    this.ref.current.addEventListener('mouseenter', this.inHandler);
    this.ref.current.addEventListener('mouseleave', this.outHandler);
    if (this.props.circle) {
      this.observer.observe(this.bgRef.current);
    }
  }

  public componentDidUpdate() {
    this.maybeTriggerPanning();
  }

  public componentWillUnmount() {
    if (this.props.circle) {
      this.observer.disconnect();
    }
    this.ref.current.removeEventListener('mouseenter', this.inHandler);
    this.ref.current.removeEventListener('mouseleave', this.outHandler);
  }

  public render() {
    const { isMarked } = this.props;
    const markedBgStyle = isMarked ? {
      opacity: 1,
    } : null;
    const contentStyle = isMarked ? {
      color: '#eee',
      fontWeight: 500,
    } : null;
    const cellProps = {
      className: this.props.className,
      colSpan: this.props.colSpan,
      rowSpan: this.props.rowSpan,
      style: this.props.style,
    };
    const content = this.props.displayCircleName ?
      this.props.children :
      getBoothNumber(this.props.booth);
    return (
      <Cell {...cellProps} ref={this.ref}>
        <BackgroundContainer>
          <Background ref={this.bgRef} />
          <MarkedBackground style={markedBgStyle} />
          <Content style={contentStyle}>{content}</Content>
        </BackgroundContainer>
      </Cell>
    );
  }

  private maybeTriggerPanning() {
    if (!this.props.isMarked || !this.props.isSearching) {
      return;
    }
    const clientRect = this.ref.current.getBoundingClientRect();
    this.props.pushSearchView({
      x: clientRect.left + (clientRect.width / 2),
      y: clientRect.top + (clientRect.height / 2),
    });
  }
}

const mapStateToProps = (state: AppState, props: BaseProps): StateToProps => ({
  displayCircleName: state.displayCircleName,
  isMarked: !!state.markedBooths[props.boothNumber],
  isSearching: state.isSearching,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  pushSearchView(searchView: SearchView) {
    dispatch(pushSearchView(searchView));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterBooth);
