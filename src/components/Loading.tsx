import * as CSS from 'csstype';
import React from 'react';

const containerStyle: CSS.Properties = {
  width: '100%',
  textAlign: 'center',
  padding: '8px',
};

const contentStyle: CSS.Properties = {
  display: 'inline-block',
  padding: '8px 16px',
  borderRadius: '6px',
  backgroundColor: '#333',
  color: 'rgba(255,255,255,0.8)',
  boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
};

const Loading: React.FC = () => (
  <div style={containerStyle}>
    <div style={contentStyle}>Loading...</div>
  </div>
);

export default Loading;
