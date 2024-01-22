// SearchParks.jsx

import React, { useState } from "react";

const SearchParks = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search Parks"
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button type="submit" style={{ display: "none" }}>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchParks;
