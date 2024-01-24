// Header.jsx

import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import logo from "../../images/resized_nature_photography_logo_100x100 (2).png";

const Header = ({ isLoggedIn, handleLogout }) => {
  return (
    <header>
      <Link to="/" className="header-logo">
        <img src={logo} alt="Park Lens Logo" id="logoElement" />
      </Link>
      <Link to="/" className="header-title" id="parkLensTitle">
        Park Lens
      </Link>
      <Navigation isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
    </header>
  );
};

export default Header;
