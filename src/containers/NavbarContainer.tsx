import Navbar from '@components/Navbar';
import NavbarPresenter from '@presenters/NavbarPresenter';
import React from 'react';

export default ({ presenter }: { presenter: NavbarPresenter }) => {
  return <Navbar selectedIndex={presenter.selectedIndex.value} />;
};
