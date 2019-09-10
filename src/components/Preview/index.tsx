import LazyImage from '@components/LazyImage';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Circle from '@models/Circle';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import CloseButton from './CloseButton';
import Information from './Information';
import { Social, SocialContainer } from './Social';

interface BaseProps {
  circle: Circle;
  onClose: () => void;
}

type PreviewProps = BaseProps;

const Content = styled.div`
padding: 0 16px 16px 16px;
`;

const ImageContainer = styled.div`
margin-bottom: 24px;
`;

const Image = styled(LazyImage)`
max-width: 224px;
`;

const CircleName = styled.h3`
margin: 0 0 4px 0;
`;

const ListItem = styled.div`
margin-bottom: 4px;
`;

class Preview extends PureComponent<PreviewProps> {
  constructor(props: PreviewProps) {
    super(props);
  }

  public render() {
    const { circle } = this.props;
    const { social, fandoms } = circle;
    const fandomEls = fandoms.map((fandom, id) => (
      <ListItem key={id}>{fandom}</ListItem>
    ));
    const socials = [
      { url: social.facebook, icon: faFacebook, social: 'Facebook' },
      { url: social.twitter, icon: faTwitter, social: 'Twitter' },
      { url: social.instagram, icon: faInstagram, social: 'Instagram' },
    ].filter((x) => !!x.url).map((x) => (
      <Social key={x.social} icon={x.icon} url={x.url} social={x.social} />
    ));
    const socialInfo = socials.length > 0 ? (
      <Information label='Social'>
        <SocialContainer>{socials}</SocialContainer>
      </Information>
    ) : null;
    return (
      <div>
        <CloseButton onClick={this.props.onClose} />
        <Content>
          <ImageContainer>
            <Image src={circle.imageUrl} width={224} height={333} />
          </ImageContainer>
          <CircleName>{circle.name}</CircleName>
          <div>{circle.boothNumber}</div>
          <Information label='Rating'>{circle.rating}</Information>
          <Information label='Fandoms'>{fandomEls}</Information>
          {socialInfo}
        </Content>
      </div>
    );
  }
}

export default Preview;
