import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { PureComponent } from 'react';
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
  private ref = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    this.ref.current.addEventListener('click', this.props.onClick);
  }

  public componentWillUnmount() {
    this.ref.current.removeEventListener('click', this.props.onClick);
  }

  public render() {
    return (
      <Container ref={this.ref}>
        <StyledIcon icon={faTimes} />
      </Container>
    );
  }
}

export default CloseButton;
