import * as React from 'react';
import styled from 'styled-components';

interface CursorTrackerState {
  x: number;
  y: number;
}

const Container = styled.div``;

const CounterWrapper = styled.div`
  display: table;
  color: #eee;
  background-color: #000;
  font-size: 48pt;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  padding: 24px;
  margin: 0;
`;

const Counter = styled.div`
  display: table-row;
`;
const CounterTitle = styled.span`
  display: table-cell;
  padding-right: 8px;
`;
const CounterNumber = styled.span`
  display: table-cell;
  text-align: right;
`;

const Wrapper = styled.div`
  cursor: crosshair;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0;
  margin: 0;
`;

export default class CursorTracker extends React.Component<{}, CursorTrackerState> {
  public state = {
    x: 0,
    y: 0,
  };

  private wrapperRef = React.createRef<HTMLDivElement>();
  private listener: (evt: MouseEvent) => void;

  constructor(props: {}) {
    super(props);
    this.listener = (evt) => {
      const el = evt.target as HTMLDivElement;
      const clientRect = el.getBoundingClientRect();
      const x = Math.round(evt.clientX - clientRect.left);
      const y = Math.round(evt.clientY - clientRect.top);
      this.setState({ x, y });
    };
  }

  public componentDidMount() {
    this.wrapperRef.current.addEventListener('mousemove', this.listener);
  }

  public componentWillUnmount() {
    this.wrapperRef.current.removeEventListener('mousemove', this.listener);
  }

  public render() {
    return (
      <Container>
        <CounterWrapper>
          <Counter>
            <CounterTitle>X:</CounterTitle>
            <CounterNumber>{this.state.x}</CounterNumber>
          </Counter>
          <Counter>
            <CounterTitle>Y:</CounterTitle>
            <CounterNumber>{this.state.y}</CounterNumber>
          </Counter>
        </CounterWrapper>
        <Wrapper ref={this.wrapperRef}>
          {this.props.children}
        </Wrapper>
      </Container>
    );
  }
}
