import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEvent, PureComponent } from 'react';
import styled from 'styled-components';

interface CloseButtonProps {
  onClick: (evt: MouseEvent) => void;
}

const Container = styled.div`
font-size: 24px;
opacity: 0.6;
`;

const StyledIcon = styled(FontAwesomeIcon)`
padding: 16px;
cursor: pointer;
`;

class CloseButton extends PureComponent<CloseButtonProps> {
  public render() {
    return (
      <Container onClick={this.props.onClick}>
        <StyledIcon icon={faTimes} />
      </Container>
    );
  }
}

export default CloseButton;
