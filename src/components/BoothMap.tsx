import * as React from 'react';
import styled from 'styled-components';
import catalog from '../data/catalog.json';
import mapping from '../data/mapping.json';
import { Cell, Cluster, Direction, Orientation } from '../models/BoothMap';
import parseBoothMap from '../utils/parseBoothMap';

const Container = styled.div`
position: absolute;
top: 0;
left: 0;
padding: 0;
margin: 0;
`;

const ClusterTable = styled.table`
position: absolute;
background-color: red;
box-sizing: border-box;
color: red;
z-index: 2;
`;

const ClusterCell = styled.td`
background: #fff;
text-align: center;
`;

const BoothCluster: React.FC<{ cluster: Cluster }> = ({ cluster }) => {
  const style = {
    top: cluster.top,
    left: cluster.left,
    width: cluster.width,
    height: cluster.height,
  };
  const rows = cluster.cells.map((row, i) => {
    const cells = row.map((cell, j) => {
      const name = cell.prefix + cell.number + cell.suffix;
      const colSpan = cell.orientation === Orientation.Vertical ? 2 : 1;
      return <ClusterCell key={j} colSpan={colSpan}>{name}</ClusterCell>;
    });
    return <tr key={i}>{cells}</tr>;
  });
  return <ClusterTable style={style}>{rows}</ClusterTable>;
};

export default class BoothMap extends React.Component {
  public render() {
    const clusters = parseBoothMap(mapping);
    const boothMaps = clusters.map((cluster, idx) => (
      <BoothCluster key={idx} cluster={cluster} />
    ));
    return <Container>{boothMaps}</Container>;
  }
}
