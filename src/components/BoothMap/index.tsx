import NavigationArea from '@components/NavigationArea';
import Preview from '@components/Preview';
import { Cluster, MarkedBooths } from '@models/Booth';
import Circle from '@models/Circle';
import { MappedBooth } from '@models/Mapped';
import { previewCircleClose } from '@store/app/actions';
import { AppState } from '@store/app/types';
import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import BoothCluster from './BoothCluster';
import PreviewArea from './PreviewArea';
import VisibilityButton from './VisibilityButton';

interface BaseProps {
  children: ReactNode;
}

interface StateToProps {
  clusters: Cluster[];
  boothMapping: {
    [key: string]: MappedBooth,
  };
  previewCircle?: Circle;
  markedBooths: MarkedBooths;
}

interface DispatchToProps {
  closePreview: () => void;
}

type BoothMapProps = BaseProps & StateToProps & DispatchToProps;

const Container = styled.div``;

const MappingArea = styled.div`
z-index: 1;
`;

const UnclickableArea: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div style={{ pointerEvents: 'none' }}>{children}</div>;
};

class BoothMap extends Component<BoothMapProps> {
  private onPreviewClose: () => void;

  constructor(props: BoothMapProps) {
    super(props);
    this.onPreviewClose = () => {
      this.props.closePreview();
    };
  }

  public render() {
    const {
      previewCircle,
      clusters,
      boothMapping,
      markedBooths,
    } = this.props;
    const boothMaps = clusters.map((cluster, idx) => (
      <BoothCluster
        key={idx}
        cluster={cluster}
        boothMapping={boothMapping}
        markedBooths={markedBooths}
      />
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
        <PreviewArea>
          {previewCircle ? <Preview circle={previewCircle} onClose={this.onPreviewClose} /> : null}
        </PreviewArea>
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState): StateToProps => ({
  clusters: state.clusters,
  boothMapping: state.boothMapping,
  previewCircle: state.previewCircle,
  markedBooths: state.markedBooths,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  closePreview() {
    dispatch(previewCircleClose());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoothMap);
