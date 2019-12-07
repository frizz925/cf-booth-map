import { USE_BROWSER_ROUTER } from '@utils/Routing';
import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';

const ManagedRouter: React.FC = ({ children }) => {
  return USE_BROWSER_ROUTER ? (
    <BrowserRouter>{children}</BrowserRouter>
  ) : (
    <HashRouter>{children}</HashRouter>
  );
};

export default ManagedRouter;
