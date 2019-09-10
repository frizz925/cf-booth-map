import mapImage from '@assets/floor_map_cf13.png';
import CursorTracker from '@components/CursorTracker';
import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
display: block;
`;

const Mapping: React.FC = () => (
  <CursorTracker>
    <Image src={mapImage} />
  </CursorTracker>
);

export default Mapping;
