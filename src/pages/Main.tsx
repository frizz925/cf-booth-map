import * as React from 'react';
import styled from 'styled-components';
import mapImage from '../assets/floor_map_cf13.png';
import BoothMap from '../components/BoothMap';
import CursorTracker from '../components/CursorTracker';

const Image = styled.img`
  display: block;
`;

export default class Main extends React.Component {
  public render() {
    return (
      <CursorTracker>
        <Image src={mapImage} />
        <BoothMap />
      </CursorTracker>
    );
  }
}
