// App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import Header from "./components/Header";
import Layout from "./components/Layout";
import SearchParks from "./components/SearchParks";
import Home from "./pages/Home";
import About from "./pages/About";
import ParkProfiles from "./pages/ParkProfiles";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginFailed, setLoginFailed] = useState(false);

  /**********************
Initial Fetches
************************/
  useEffect(() => {
    fetch(`http://localhost:5555/check_session`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => setUser(data));
        }
      })
      .then(console.log(user));
  }, [setUser]);

  /**********************
Authentication
************************/

  async function handleLogin(userInfo) {
    try {
      const res = await fetch(`http://localhost:5555/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
        setLoginFailed(false);
        console.log("set login to true");
        return true; // successful login
      } else {
        throw res;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginFailed(true);
      return false; // failed login
    }
  }

  function handleLogout() {
    fetch(`http://localhost:5555/logout`, { method: "DELETE" }).then((res) => {
      if (res.ok) {
        setUser(null);
        console.log("set login to false");
        setIsLoggedIn(false);
      }
    });
  }

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  isLoggedIn={isLoggedIn}
                  handleLogin={handleLogin}
                  handleLogout={handleLogout}
                  user={user}
                  setUser={setUser}
                  setLoginFailed={setLoginFailed}
                  loginFailed={loginFailed}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/parks/:id" element={<ParkProfiles />} />{" "}
            {/* Updated route to include park ID */}
            <Route path="/search-parks" element={<SearchParks />} />{" "}
            {/* Optional: Added route for SearchParks */}
            {/* You can add more routes here as needed */}
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
