import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';

const ROTATING_TEXT_DURATION = 1500;

interface LoadingState {
  angle: number;
}

const LoadingContainer = styled.div`
position: absolute;
top: 0;
left: 0;
display: table;
width: 100vw;
height: 100vh;
line-hegiht: 16px;
`;

const LoadingText = styled.div`
position: relative;
display: table-cell;
vertical-align: middle;
text-align: center;
width: 100%;
height: 100%;
`;

const MainText = styled.div`
margin-bottom: 16px;
`;

const RotatingTextContainer = styled.div`
`;

const RotatingText: React.FC<{ children: ReactNode, angle: number }> = (props) => (
  <RotatingTextContainer style={{ transform: `rotate(${props.angle}deg)` }}>
    {props.children}
  </RotatingTextContainer>
);

export default class Loading extends Component<{}, LoadingState> {
  private lastTs: number;
  private running: boolean;

  private rotateText: (timestamp: number) => void;

  constructor(props: {}) {
    super(props);
    this.running = false;
    this.state = {
      angle: 0,
    };
    this.rotateText = (timestamp: number) => {
      if (!this.running) {
        return;
      }
      if (!this.lastTs) {
        this.lastTs = timestamp;
      }

      const angle = (timestamp - this.lastTs) / ROTATING_TEXT_DURATION * 360;
      if (angle >= 360) {
        this.lastTs = timestamp;
        this.setState({ angle: 0 });
      } else {
        this.setState({ angle });
      }
      window.requestAnimationFrame(this.rotateText);
    };
  }

  public componentDidMount() {
    this.running = true;
    this.rotateText(new Date().getTime());
  }

  public componentWillUnmount() {
    this.running = false;
  }

  public render() {
    return (
      <LoadingContainer>
        <LoadingText>
          <MainText>Preparing the app for you</MainText>
          <RotatingText angle={this.state.angle}>uwu</RotatingText>
        </LoadingText>
      </LoadingContainer>
    );
  }
}
