import React from "react";
import { NavLink } from "react-router-dom";
import SearchParks from "./SearchParks";

const Navigation = ({ isLoggedIn, handleLogout }) => {
  const handleSignOut = async () => {
    try {
      // logout user
      await fetch("http://localhost:5555/logout", { method: "DELETE" });
      console.log("Logged Out.");
      handleLogout();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            About
          </NavLink>
        </li>
        <li>
          {isLoggedIn ? (
            <button onClick={handleSignOut} className="nav-button">
              Sign Out
            </button>
          ) : (
            <NavLink
              to="/account"
              className={({ isActive }) =>
                isActive ? "nav-button active" : "nav-button"
              }
            >
              Sign In
            </NavLink>
          )}
        </li>
        <li>
          <SearchParks />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
