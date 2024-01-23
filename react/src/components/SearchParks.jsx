// SearchParks.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchParks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [parks, setParks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all parks data from the backend
    fetch("http://localhost:5555/parks")
      .then((response) => response.json())
      .then((data) => {
        setParks(data); // Assuming the API returns an array of park objects
      })
      .catch((error) => console.error("Error fetching parks:", error));
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    let matches = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      matches = parks.filter((park) => regex.test(park.name));
    }
    setSuggestions(matches);
  };

  const handleSuggestionClick = (park) => {
    setSearchTerm(""); // Clear the search field
    setSuggestions([]); // Clear the suggestions
    navigate(`/parks/${park.id}`, { state: { selectedPark: park } });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Parks"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div>
        {suggestions.map((park, index) => (
          <div key={index} onClick={() => handleSuggestionClick(park)}>
            {park.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchParks;
