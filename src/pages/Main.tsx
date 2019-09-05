import * as React from 'react';
import styled from 'styled-components';
import mapImage from '../assets/floor_map_cf13.png';

const Image = styled.img`
display: block;
`;
const Container = styled.div``;
const BoothMap = React.lazy(() => import('../components/BoothMap'));

const Main: React.FC = () => (
  <Container>
    <BoothMap>
      <Image src={mapImage} />
    </BoothMap>
  </Container>
);

export default Main;
