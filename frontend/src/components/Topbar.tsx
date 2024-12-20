import { Link } from 'react-router-dom';
import logo from '../images/planYourTripLogo.png';

import '../styles/Topbar.css';

const Topbar = () => {
  return (
    <div className="topbar" data-testid="topbar">
      <Link to="/" className="nav-link">
        <img
          className="topbar-img"
          src={logo}
          alt="Logo with text 'plan your trip' and icon of the earth."
        />
      </Link>
    </div>
  );
};

export default Topbar;
