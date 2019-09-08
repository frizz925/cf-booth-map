import { AppState } from '@store/app/types';
import React, { PureComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

interface BaseProps {
  children?: ReactNode;
}

interface StateToProps {
  previewShown: boolean;
}

type PreviewAreaProps = BaseProps & StateToProps;

const Container = styled.div`
background-color: #fff;
position: fixed;
top: 100%;
left: 0;
width: 100%;
height: 100%;
overflow: scroll;
z-index: 20;
transition: top 0.4s;
transition-timing-function: ease;
`;

class PreviewArea extends PureComponent<PreviewAreaProps> {
  public render() {
    const { children, previewShown } = this.props;
    const style = previewShown ? {
      top: '0%',
    } : null;
    return (
      <Container style={style}>
        {children}
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState): StateToProps => ({
  previewShown: state.previewShown,
});

export default connect(mapStateToProps)(PreviewArea);
