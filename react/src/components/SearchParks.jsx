import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SearchParks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [parks, setParks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5555/parks")
      .then((response) => response.json())
      .then((data) => {
        setParks(data);
      })
      .catch((error) => console.error("Error fetching parks:", error));
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

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
    <div className="relative">
      <input
        type="text"
        placeholder="Search Parks..."
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="search-bar focus:outline-none"
      />
      {suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          {suggestions.map((park, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(park)}
              className={`p-2 cursor-pointer suggestion-item ${
                index === highlightedIndex ? "highlighted-item" : ""
              }`}
            >
              {park.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchParks;
