// Account.jsx

import React, { useState } from "react";

const Account = ({ isLoggedIn, handleLogin, handleLogout }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const resetUserData = () => {
    setUserData({ firstName: "", lastName: "", username: "", password: "" });
  };

  const apiRequest = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response:", responseData);
        handleLogin(responseData);
        resetUserData();

        if (isLoggingIn) {
          console.log("Logged in");
        } else {
          console.log("Account created");
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleLogin = () => {
    setIsLoggingIn(!isLoggingIn);
    resetUserData();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiUrl = isLoggingIn
      ? "http://localhost:5555/login"
      : "http://localhost:5555/users";
    const requestData = isLoggingIn
      ? { username: userData.username, password: userData.password }
      : {
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username,
          password: userData.password,
        };

    await apiRequest(apiUrl, requestData);
  };

  if (!isLoggedIn) {
    return (
      <div className="center-container">
        <div className="account-container">
          <h2>{isLoggingIn ? "Sign In" : "Sign Up"}</h2>
          <form onSubmit={handleSubmit}>
            {!isLoggingIn && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  className="input-field"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input-field"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                />
              </>
            )}
            <input
              type="text"
              placeholder="Username"
              className="input-field"
              name="username"
              value={userData.username}
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
  }

  return (
    <div className="center-container">
      <div className="account-container">
        <h2>Welcome to Park Lens!</h2>
      </div>
    </div>
  );
};

export default Account;
