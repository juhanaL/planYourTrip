import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import '../styles/Navbar.css';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hideSidebarWhenClickedOutside = (event: MouseEvent) => {
      if (showNavbar && navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setShowNavbar(false);
      }
    };

    if (showNavbar) {
      document.addEventListener('mousedown', hideSidebarWhenClickedOutside);
    }

    return () => {
      document.removeEventListener('mousedown', hideSidebarWhenClickedOutside);
    };
  }, [showNavbar]);

  const navbarItemsList = [
    { path: '/', text: 'Home', icon: 'fa-home' },
    { path: '/weathermap', text: 'Weather map', icon: 'fa-globe' },
    { path: '/todo', text: 'Trip To Do', icon: 'fa-check-square-o' },
  ];

  const navbarToggle = (
    <div
      className="navbar-element navbar-toggle"
      onClick={() => {
        setShowNavbar(!showNavbar);
      }}
      onKeyDown={() => {
        setShowNavbar(!showNavbar);
      }}
      role="button"
      aria-label="toggle for navigation bar"
      tabIndex={0}
    >
      <i
        className={`fa fa-navbar-icon fa-navbar-toggle-icon fa-navbar-icon-${showNavbar ? 'expanded fa-chevron-left' : 'closed fa-chevron-right'}`}
        data-testid={`${showNavbar ? 'fa-chevron-left' : 'fa-chevron-right'}`}
      />
    </div>
  );

  const navbarItems = navbarItemsList.map((item) => {
    return (
      <div key={item.text}>
        <Link to={item.path} className="nav-link">
          <div
            className={`navbar-element navbar-item-${showNavbar ? 'expanded' : 'closed'}`}
            onClick={() => {
              setShowNavbar(false);
            }}
            onKeyDown={() => {
              setShowNavbar(false);
            }}
            role="button"
            aria-label="navigation bar link element"
            tabIndex={0}
          >
            {showNavbar && <span className="navbar-text">{item.text}</span>}
            <i
              className={`fa fa-navbar-icon fa-navbar-icon-${showNavbar ? 'expanded' : 'closed'} ${item.icon}`}
              data-testid={`${item.icon}`}
            />
          </div>
        </Link>
      </div>
    );
  });

  return (
    <div
      className={`navbar ${showNavbar ? 'expanded' : 'closed'}-navbar`}
      ref={navbarRef}
      data-testid={`${showNavbar ? 'expanded' : 'closed'}-navbar`}
    >
      {navbarToggle}
      <div className="navbar-items">{navbarItems}</div>
    </div>
  );
};

export default Navbar;
