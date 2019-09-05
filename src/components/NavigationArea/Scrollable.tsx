import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';

interface ScrollableProps {
  children: ReactNode;
  x: number;
  y: number;
}

const ScrollableContainer = styled.div`
position: absolute;
top: -50%;
left: -50%;
`;

export default class Scrollable extends Component<ScrollableProps> {
  private containerRef = React.createRef<HTMLDivElement>();

  constructor(props: ScrollableProps) {
    super(props);
  }

  public render() {
    const style = {
      left: this.props.x,
      top: this.props.y,
    };
    return (
      <ScrollableContainer ref={this.containerRef} style={style}>
        {this.props.children}
      </ScrollableContainer>
    );
  }
}
