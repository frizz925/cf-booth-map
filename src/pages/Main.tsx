import * as React from 'react';
import styled from 'styled-components';
import mapImage from '../assets/floor_map_cf13.png';
import BoothMap from '../components/BoothMap';

const Container = styled.div``;
const Image = styled.img`
  display: block;
`;

export default class Main extends React.Component {
  public render() {
    return (
      <Container>
        <Image src={mapImage} />
        <BoothMap />
      </Container>
    );
  }
}
