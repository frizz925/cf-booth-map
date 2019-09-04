import * as React from 'react';
import styled from 'styled-components';
import catalog from '../data/catalog.json';
import mapping from '../data/mapping.json';
import parseBoothMap from '../utils/parseBoothMap';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
`;
const ClusterContainer = styled.div`
  position: absolute;
  border: 1px solid red;
  box-sizing: border-box;
  padding: 8px;
  color: red;
  z-index: 2;
`;

export default class BoothMap extends React.Component {
  public render() {
    const clusters = parseBoothMap(mapping);
    const boothMaps = clusters.map((cluster, idx) => {
      const style = {
        top: cluster.top,
        left: cluster.left,
        width: cluster.width,
        height: cluster.height,
      };
      return <ClusterContainer key={idx} style={style}>{cluster.name}</ClusterContainer>;
    });
    return <Container>{boothMaps}</Container>;
  }
}
