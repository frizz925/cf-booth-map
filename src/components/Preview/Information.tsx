import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface InformationProps {
  label: string;
  children: ReactNode;
}

const InformationContainer = styled.div`
margin-top: 12px;
`;

const InformationLabel = styled.div`
margin-bottom: 4px;
font-size: 10pt;
opacity: 0.4;
`;

const Information: React.FC<InformationProps> = ({ label, children }) => children ? (
  <InformationContainer>
    <InformationLabel>{label}</InformationLabel>
    <div>{children}</div>
  </InformationContainer>
) : null;

export default Information;
