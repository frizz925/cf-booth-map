import React from 'react';
import styled from 'styled-components';
import mapImage from '../assets/floor_map_cf13.png';
import CursorTracker from '../components/CursorTracker';

const Image = styled.img`
display: block;
`;

const Mapping: React.FC = () => (
  <CursorTracker>
    <Image src={mapImage} />
  </CursorTracker>
);

export default Mapping;
