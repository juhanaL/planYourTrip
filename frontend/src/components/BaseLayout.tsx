import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Topbar from './Topbar';

import '../styles/BaseLayout.css';

const BaseLayout = () => {
  return (
    <>
      <div className="topbar-container">
        <Topbar />
      </div>
      <div className="nav-and-content">
        <Navbar />
        <div className="main-content" data-testid="main-content" id="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default BaseLayout;
