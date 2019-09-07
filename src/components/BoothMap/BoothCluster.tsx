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

const StyledClusterBooth = styled(ClusterBooth)`
background-color: #fff;
text-align: center;
font-size: 9pt;
overflow: hidden;
overflow-wrap: break-word;
padding: 0 4px;
transition: color 0.3s, background-color 0.6s;
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
          <StyledClusterBooth
            key={boothNumber}
            boothNumber={boothNumber}
            booth={booth}
            circle={circle}
            colSpan={colSpan}
          >
            {name}
          </StyledClusterBooth>
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
