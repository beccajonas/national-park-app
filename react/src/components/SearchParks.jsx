// SearchParks.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SearchParks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [parks, setParks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5555/parks")
      .then((response) => response.json())
      .then((data) => {
        setParks(data);
      })
      .catch((error) => console.error("Error fetching parks:", error));
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);

    let matches = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      matches = parks.filter((park) => regex.test(park.name));
    }
    setSuggestions(matches);
  };

  const handleSuggestionClick = (park) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/parks/${park.id}`, { state: { selectedPark: park } });
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      handleSuggestionClick(suggestions[highlightedIndex]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Parks"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="search-bar"
      />
      <div>
        {suggestions.map((park, index) => (
          <div
            key={index}
            onClick={() => handleSuggestionClick(park)}
            className={`suggestion-item ${
              index === highlightedIndex ? "highlighted" : ""
            }`}
          >
            {park.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchParks;
