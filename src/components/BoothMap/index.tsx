import NavigationArea from '@components/NavigationArea';
import { Cluster } from '@models/Booth';
import { MappedBooth } from '@models/Mapped';
import { AppState } from '@store/app/types';
import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import BoothCluster from './BoothCluster';
import VisibilityButton from './VisibilityButton';

interface BaseProps {
  children: ReactNode;
}

interface StateToProps {
  clusters: Cluster[];
  boothMapping: {
    [key: string]: MappedBooth,
  };
}

type BoothMapProps = BaseProps & StateToProps;

const Container = styled.div``;

const MappingArea = styled.div`
z-index: 1;
`;

const UnclickableArea: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div style={{ pointerEvents: 'none' }}>{children}</div>;
};

class BoothMap extends Component<BoothMapProps> {
  public render() {
    const { clusters, boothMapping } = this.props;
    const boothMaps = clusters.map((cluster, idx) => (
      <BoothCluster key={idx} cluster={cluster} boothMapping={boothMapping} />
    ));
    return (
      <Container className='booth-map'>
        <NavigationArea>
          <UnclickableArea>
            {this.props.children}
          </UnclickableArea>
          <MappingArea>
            {boothMaps}
          </MappingArea>
        </NavigationArea>
        <VisibilityButton />
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState): StateToProps => ({
  clusters: state.clusters,
  boothMapping: state.boothMapping,
});

export default connect(mapStateToProps)(BoothMap);
