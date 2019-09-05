import * as React from 'react';
import styled from 'styled-components';
import mapImage from '../assets/floor_map_cf13.png';
import CursorTracker from '../components/CursorTracker';
import { isDevelopment } from '../utils/env';

const Image = styled.img`
display: block;
`;
const Container = isDevelopment ? CursorTracker : styled.div``;
const BoothMap = React.lazy(() => import('../components/BoothMap'));
const Main: React.FC = () => (
  <Container>
    <Image src={mapImage} />
    <BoothMap />
  </Container>
);

export default Main;
