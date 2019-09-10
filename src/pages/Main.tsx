import mapImage from '@assets/floor_map_cf13.webp';
import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
display: block;
`;
const Container = styled.div``;

const SearchForm = React.lazy(() => import('@components/SearchForm'));
const Drawer = React.lazy(() => import('@components/Drawer'));
const BoothMap = React.lazy(() => import('@components/BoothMap'));
const Main: React.FC = () => (
  <Container>
    <SearchForm />
    <Drawer />
    <BoothMap>
      <Image src={mapImage} alt='Floor plan'/>
    </BoothMap>
  </Container>
);

export default Main;
