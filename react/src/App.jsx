// App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Layout from "./components/Layout";
import SearchParks from "./components/SearchParks"; // Corrected import path
import Home from "./pages/Home";
import Account from "./pages/Account";
import About from "./pages/About";
import ParkProfiles from "./pages/ParkProfiles";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/account"
              element={
                <Account
                  isLoggedIn={isLoggedIn}
                  handleLogin={handleLogin}
                  handleLogout={handleLogout}
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
