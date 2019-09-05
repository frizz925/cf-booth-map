import CSS from 'csstype';
import { assign } from 'lodash';
import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';

interface TransformableProps {
  children: ReactNode;
  x?: number;
  y?: number;
  z?: number;
  scale?: number;
  angle?: number;
  style?: CSS.Properties;
}

const TransformableContainer = styled.div`
width: 100%;
height: 100%;
`;

export default class Transformable extends Component<TransformableProps> {
  constructor(props: TransformableProps) {
    super(props);
  }

  public render() {
    const x = this.props.x || 0;
    const y = this.props.y || 0;
    const z = this.props.z || 0;
    const scale = this.props.scale || 1.0;
    const angle = this.props.angle || 0.0;
    const transforms = [
      `scale(${scale}, ${scale})`,
      `rotate3d(0, 0, 1, ${angle}deg)`,
      `translate3d(${x}px, ${y}px, ${z}px)`,
    ];
    const style = assign({
      transform: transforms.join(' '),
    }, this.props.style);
    return (
      <TransformableContainer style={style}>
        {this.props.children}
      </TransformableContainer>
    );
  }
}
