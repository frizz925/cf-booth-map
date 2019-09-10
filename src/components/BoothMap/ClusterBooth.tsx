import Booth from '@models/Booth';
import Circle from '@models/Circle';
import { SearchView } from '@models/Search';
import { previewCircle, pushSearchView } from '@store/app/actions';
import { AppState } from '@store/app/types';
import getBoothNumber from '@utils/booth';
import CSS from 'csstype';
import { assign } from 'lodash';
import React, { PureComponent, ReactNode, TdHTMLAttributes } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';

interface BaseProps {
  isMarked: boolean;
  boothNumber: string;
  booth: Booth;
  circle?: Circle;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  children?: ReactNode;
  style?: CSS.Properties;
}

interface StateToProps {
  displayCircleName: boolean;
  isSearching: boolean;
}

interface DispatchToProps {
  pushSearchView: (searchView: SearchView) => void;
  previewCircle: (circle: Circle) => void;
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
transition: background-color 0.5s, color 0.3s;
cursor: pointer;
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
  el: HTMLElement;
  src: string;
}

const experimentalBoothBg = false;
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

    const { el, src } = job;
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = `url(${src})`;
      counter.value--;
      observer.unobserve(el);
      process.nextTick(runQueue);
    };
    img.src = src;
    if (img.complete) {
      img.onload(null);
    }
    counter.value++;
  }
  counter.running = false;
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) {
      return;
    }

    const el = e.target as HTMLElement;
    const src = el.getAttribute('data-src');
    queue.push({ el, src });
  });
  process.nextTick(runQueue);
});

class ClusterBooth extends PureComponent<ClusterBoothProps, ClusterBoothState> {
  private ref = React.createRef<HTMLTableCellElement>();
  private bgRef = React.createRef<HTMLDivElement>();

  private clickHandler: () => void;
  private inHandler: () => void;
  private outHandler: () => void;

  constructor(props: ClusterBoothProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
    this.clickHandler = () => {
      if (props.circle) {
        props.previewCircle(props.circle);
      }
    };
    this.inHandler = () => {
      this.setState({ isHovered: true });
    };
    this.outHandler = () => {
      this.setState({ isHovered: false });
    };
  }

  public componentDidMount() {
    this.maybeTriggerPanning();
    if (experimentalBoothBg && this.bgRef.current) {
      observer.observe(this.bgRef.current);
    }
  }

  public componentDidUpdate() {
    this.maybeTriggerPanning();
  }

  public componentWillUnmount() {
    if (experimentalBoothBg && this.bgRef.current) {
      observer.unobserve(this.bgRef.current);
    }
  }

  public render() {
    const { circle, isMarked } = this.props;
    const baseStyle = !circle ? {
      cursor: 'auto',
    } : null;
    const cellMarkedStyle = isMarked ? {
      backgroundColor: '#1875d1',
      color: '#fff',
    } : null;
    const mergedStyle = Object.assign(baseStyle || {}, cellMarkedStyle);

    const markedBgStyle = isMarked ? {
      opacity: 1,
    } : null;
    const contentStyle = isMarked ? {
      color: '#eee',
      fontWeight: 500,
    } : null;
    const cellProps: TdHTMLAttributes<{}> & { ref: React.RefObject<HTMLTableCellElement> } = {
      ref: this.ref,
      className: this.props.className,
      colSpan: this.props.colSpan,
      rowSpan: this.props.rowSpan,
      style: experimentalBoothBg ? this.props.style : assign(mergedStyle, this.props.style),
      onClick: this.clickHandler,
      onMouseEnter: this.inHandler,
      onMouseLeave: this.outHandler,
    };
    const content = this.props.displayCircleName ?
      this.props.children :
      getBoothNumber(this.props.booth);
    return experimentalBoothBg ? (
      <Cell {...cellProps}>
        <BackgroundContainer>
          {circle ? <Background ref={this.bgRef} data-src={circle.imageUrl} /> : null}
          <MarkedBackground style={markedBgStyle} />
          <Content style={contentStyle}>{content}</Content>
        </BackgroundContainer>
      </Cell>
    ) : <Cell {...cellProps}>{content}</Cell>;
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

const mapStateToProps = (state: AppState): StateToProps => ({
  displayCircleName: state.displayCircleName,
  isSearching: state.isSearching,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  pushSearchView(searchView: SearchView) {
    dispatch(pushSearchView(searchView));
  },
  previewCircle(circle: Circle) {
    dispatch(previewCircle(circle));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterBooth);
