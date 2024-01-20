import React from 'react';
import GoBackButton from '../Components/GobackButton.js';

function Layout({ children }) {
  return (
    <div>
      <GoBackButton />
      {children}
    </div>
  );
}

export default Layout;
