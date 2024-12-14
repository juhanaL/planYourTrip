import { Link } from 'react-router-dom';

import '../styles/Topbar.css';

const Topbar = () => {
  return (
    <div className="topbar" data-testid="topbar">
      <Link to="/" className="nav-link">
        <img
          className="topbar-img"
          src="../src/images/planYourTripLogo.png"
          alt="Logo with text 'plan your trip' and icon of the earth."
        />
      </Link>
    </div>
  );
};

export default Topbar;
