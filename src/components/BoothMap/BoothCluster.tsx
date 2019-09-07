import { Cluster, Orientation } from '@models/Booth';
import { MappedBooth } from '@models/Mapped';
import getBoothNumber from '@utils/booth';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import ClusterBooth from './ClusterBooth';

interface BoothClusterProps {
  cluster: Cluster;
  boothMapping: {
    [key: string]: MappedBooth,
  };
}

const ClusterTable = styled.table`
position: absolute;
background-color: #000;
box-sizing: border-box;
table-layout: fixed;
width: 100%;
color: #000;
`;

const ClusterRow = styled.tr`
margin: 0;
padding: 0;
`;

class BoothCluster extends PureComponent<BoothClusterProps> {
  public render() {
    const { cluster, boothMapping } = this.props;
    const style = {
      top: cluster.top,
      left: cluster.left,
      width: cluster.width,
      height: cluster.height,
    };

    const rows = cluster.booths.map((row, i) => {
      const booths = row.map((booth) => {
        const boothNumber = getBoothNumber(booth);
        const mappedBooth = boothMapping[boothNumber];
        const circle = mappedBooth ? mappedBooth.circle : null;
        const name = circle ? circle.name : boothNumber;

        const isVertical = booth.orientation === Orientation.Vertical;
        const colSpan = isVertical ? 2 : 1;
        return (
          <ClusterBooth
            key={boothNumber}
            boothNumber={boothNumber}
            booth={booth}
            circle={circle}
            colSpan={colSpan}
          >
            {name}
          </ClusterBooth>
        );
      });
      return <ClusterRow key={i}>{booths}</ClusterRow>;
    });

    return (
      <ClusterTable style={style}>
        <tbody>{rows}</tbody>
      </ClusterTable>
    );
  }
}

export default BoothCluster;
