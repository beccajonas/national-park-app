// Account.jsx

import React, { useState } from "react";

const Account = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const toggleLogin = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the user data
    console.log("User Data:", userData);
    // Add logic for registration or login here
  };

  return (
    <div className="center-container">
      {" "}
      {/* Wrapper for centering */}
      <div className="account-container">
        <h2>{isLoggingIn ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLoggingIn && (
            <input
              type="text"
              placeholder="Username"
              className="input-field"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
          />
          <button type="submit" className="action-button">
            {isLoggingIn ? "Log In" : "Sign Up"}
          </button>
        </form>
        <button onClick={toggleLogin} className="toggle-button">
          {isLoggingIn
            ? "Need to create an account?"
            : "Already have an account?"}
        </button>
      </div>
    </div>
  );
};

export default Account;
