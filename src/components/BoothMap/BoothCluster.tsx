import { Cluster, MarkedBooths, Orientation } from '@models/Booth';
import { MappedBooth } from '@models/Mapped';
import getBoothNumber from '@utils/booth';
import reactiveState from '@utils/reactiveState';
import CSS from 'csstype';
import { each } from 'lodash';
import React, { PureComponent, RefObject } from 'react';
import styled from 'styled-components';
import ClusterBooth from './ClusterBooth';

interface BoothClusterProps {
  cluster: Cluster;
  boothMapping: {
    [key: string]: MappedBooth,
  };
  markedBooths: MarkedBooths;
}

interface BoothClusterState {
  shouldDraw: boolean;
}

const ClusterBorder = styled.div`
position: absolute;
background-color: #fff;
border: 2px solid #000;
`;

const ClusterTable = styled.table`
position: absolute;
background-color: #000;
box-sizing: border-box;
table-layout: fixed;
color: #000;
`;

const ClusterRow = styled.tr`
margin: 0;
padding: 0;
`;

class BoothCluster extends PureComponent<BoothClusterProps, BoothClusterState> {
  private reactiveState = reactiveState(this);

  private tableRef = React.createRef<HTMLTableElement>();
  private borderRef = React.createRef<HTMLDivElement>();

  private tableObserver: IntersectionObserver;
  private borderObserver: IntersectionObserver;

  constructor(props: BoothClusterProps) {
    super(props);
    this.state = {
      shouldDraw: false,
    };

    this.tableObserver = new IntersectionObserver((entries) => {
      if (!this.state.shouldDraw) {
        return;
      }
      const shouldHide = entries.every((e) => {
        return !e.isIntersecting;
      });
      if (shouldHide) {
        this.reactiveState.shouldDraw = false;
      }
    });
    this.borderObserver = new IntersectionObserver((entries) => {
      if (this.state.shouldDraw) {
        return;
      }
      const shouldDraw = entries.some((e) => {
        return e.isIntersecting;
      });
      if (shouldDraw) {
        this.reactiveState.shouldDraw = true;
      }
    });
  }

  public componentDidMount() {
    this.observeElements();
  }

  public componentDidUpdate() {
    this.observeElements();
  }

  public componentWillUnmount() {
    this.tableObserver.disconnect();
    this.borderObserver.disconnect();
  }

  public render() {
    const { cluster, boothMapping, markedBooths } = this.props;
    const { shouldDraw } = this.state;
    const style: CSS.Properties = {
      top: cluster.top + 'px',
      left: cluster.left + 'px',
      width: cluster.width + 'px',
      height: cluster.height + 'px',
    };

    let hasMarkedBooth = false;
    each(markedBooths, (markedCluster, markedBoothNumber) => {
      if (markedCluster.name !== cluster.name) {
        return;
      }
      hasMarkedBooth = cluster.booths.flat().some((booth) => {
        const boothNumber = getBoothNumber(booth);
        return markedBoothNumber === boothNumber;
      });
      if (hasMarkedBooth) {
        return false;
      }
    });

    if (!shouldDraw && !hasMarkedBooth) {
      return <ClusterBorder ref={this.borderRef} style={style}/>;
    }

    const rows = cluster.booths.map((row, i) => {
      const booths = row.map((booth) => {
        const boothNumber = getBoothNumber(booth);
        const mappedBooth = boothMapping[boothNumber];
        const circle = mappedBooth ? mappedBooth.circle : null;
        const name = circle ? circle.name : boothNumber;

        const isMarked = !!markedBooths[boothNumber];
        const isVertical = booth.orientation === Orientation.Vertical;
        const colSpan = isVertical ? 2 : 1;
        return (
          <ClusterBooth
            key={boothNumber}
            isMarked={isMarked}
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
      <ClusterTable ref={this.tableRef} style={style}>
        <tbody>{rows}</tbody>
      </ClusterTable>
    );
  }

  private observeElements() {
    this.maybeObserveTable(this.tableRef.current);
    this.maybeObserveBorder(this.borderRef.current);
  }

  private maybeObserveTable(el?: HTMLElement) {
    if (el) {
      this.tableObserver.observe(el);
    }
  }

  private maybeObserveBorder(el?: HTMLElement) {
    if (el) {
      this.borderObserver.observe(el);
    }
  }
}

export default BoothCluster;
