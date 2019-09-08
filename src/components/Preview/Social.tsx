import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

export const SocialContainer = styled.div`
display: table;
`;

const SocialLink = styled.a`
display: table-row;
opacity: 0.6;
line-height: 24px;
`;

const SocialIcon = styled(FontAwesomeIcon)`
display: table-cell;
font-size: 24px;
vertical-align: middle;
padding: 6px 8px 6px 0;
`;

const SocialText = styled.div`
display: table-cell;
padding-left: 8px;
padding: 6px 0;
vertical-align: middle;
`;

export const Social: React.FC<{ icon: IconDefinition, url: string, social: string }> = (props) => (
  <SocialLink href={normalizeUrl(props.url)} target='_blank'>
    <SocialIcon icon={props.icon}/>
    <SocialText>{props.social}</SocialText>
  </SocialLink>
);

const normalizeUrl = (url: string): string => {
  const [firstToken] = url.split(', ');
  if (firstToken.match(/^https?:\/\//)) {
    return firstToken;
  }
  return 'https://' + firstToken;
};
