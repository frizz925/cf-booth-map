import React from 'react';
import { Switch } from 'react-router';

const Page: React.FC = props => {
  return <Switch>{props.children}</Switch>;
};

export default Page;
