// Navigation.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import SearchParks from "./SearchParks";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/account"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Sign In
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About
          </NavLink>
        </li>
        <li>
          <SearchParks />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
