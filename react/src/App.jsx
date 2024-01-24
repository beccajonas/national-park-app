// App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import Header from "./components/Header";
import Layout from "./components/Layout";
import SearchParks from "./components/SearchParks";
import Home from "./pages/Home";
import About from "./pages/About";
import ParkProfiles from "./pages/ParkProfiles";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null)

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
    .then(console.log(user))
}, [setUser]);

/**********************
Authentication
************************/
function handleLogin(userInfo) {
  fetch(`http://localhost:5555/login`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Accepts: "application/json",
      },
      body: JSON.stringify(userInfo),
  })
      .then((res) => {
          if (res.ok) {
              return res.json();
          }
          throw res;
      })
      .then((data) => {
        setUser(data);
        setIsLoggedIn(true);
        console.log('set login to true'); 
      })
      .catch((error) => console.error("Error logging in:", error));
}

  function handleLogout() {
    fetch(`http://localhost:5555/logout`, { method: "DELETE" }).then((res) => {
        if (res.ok) {
            setUser(null)
            console.log('set login to false');
            setIsLoggedIn(false)
        }
    })
  }

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Layout>
          <Routes>
            <Route path="/" 
            element={<Home isLoggedIn={isLoggedIn} 
                          handleLogin={handleLogin}
                          handleLogout={handleLogout}
                          user={user}
                          setUser={setUser} />} 
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