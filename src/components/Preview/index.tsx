import Circle from '@models/Circle';
import React, { PureComponent } from 'react';
import styled from 'styled-components';

interface BaseProps {
  circle: Circle;
}

type PreviewProps = BaseProps;

const Container = styled.div`
padding: 16px;
`;

const ImageContainer = styled.div`
margin-bottom: 12px;
`;

const CircleName = styled.h3`
margin: 0;
`;

class Preview extends PureComponent<PreviewProps> {
  public render() {
    const { circle } = this.props;
    return (
      <Container>
        <ImageContainer>
          <img src={circle.imageUrl} />
        </ImageContainer>

        <CircleName>{circle.name}</CircleName>
        <div>{circle.boothNumber}</div>
        <pre>
          {JSON.stringify(circle, null, 2)}
        </pre>
      </Container>
    );
  }
}

export default Preview;
