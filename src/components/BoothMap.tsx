import { range } from 'lodash';
import React, { Component, ReactNode } from 'react';
import styled from 'styled-components';
import mapping from '../data/mapping.json';
import { Cluster, Orientation } from '../models/BoothMap';
import parseBoothMap from '../utils/parseBoothMap';
import NavigationArea from './NavigationArea';

interface BoothMapProps {
  children: ReactNode;
}

const Container = styled.div``;

const ClusterTable = styled.table`
position: absolute;
background-color: #000;
box-sizing: border-box;
color: #000;
z-index: 1;
`;

const ClusterRow = styled.tr`
margin: 0;
padding: 0;
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
      const name = cell.prefix + zeropad(cell.number, 2) + cell.suffix;
      const colSpan = cell.orientation === Orientation.Vertical ? 2 : 1;
      return <ClusterCell key={j} colSpan={colSpan}>{name}</ClusterCell>;
    });
    return <ClusterRow key={i}>{cells}</ClusterRow>;
  });
  return (
    <ClusterTable style={style}>
      <tbody>{rows}</tbody>
    </ClusterTable>
  );
};

export default class BoothMap extends Component<BoothMapProps> {
  public render() {
    const clusters = parseBoothMap(mapping);
    const boothMaps = clusters.map((cluster, idx) => (
      <BoothCluster key={idx} cluster={cluster} />
    ));
    return (
      <Container>
        <NavigationArea>
          {this.props.children}
          {boothMaps}
        </NavigationArea>
      </Container>
    );
  }
}

function zeropad(value: number, pad: number) {
  const result = range(pad).map(() => '0').join() + value;
  return result.substring(result.length - pad);
}
