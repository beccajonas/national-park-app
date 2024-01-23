// SearchParks.jsx

import React, { useState, useEffect } from "react";

const SearchParks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [parks, setParks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5555/parks")
      .then((response) => response.json())
      .then((data) => {
        setParks(data.map((park) => park.name));
      })
      .catch((error) => console.error("Error fetching parks:", error));
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter for suggestions
    let matches = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      matches = parks.filter((park) => regex.test(park));
    }
    setSuggestions(matches);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    console.log("Selected park:", suggestion);
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search Parks"
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchParks;
