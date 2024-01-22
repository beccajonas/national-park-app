// Account.jsx

import React, { useState } from "react";

const Account = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const toggleLogin = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggingIn) {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: userData.firstName,
            last_name: userData.lastName,
            username: userData.username,
            password: userData.password,
          }),
        });

        // Check if the response has content
        if (
          response.headers.get("content-length") === "0" ||
          response.status === 204
        ) {
          console.log("Account created successfully");
          // Handle successful account creation here
          return;
        }

        const data = await response.json();
        if (response.ok) {
          console.log("Account created:", data);
          // Handle successful account creation with data
        } else {
          console.error("Error creating account:", data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      // Add login logic here if needed
    }
  };

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
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
              />
            </>
          )}
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
