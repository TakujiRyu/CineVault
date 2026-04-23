import React from "react";
import "./search.css";

function Search({ searchQuery, setSearchQuery }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search movies or blogs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ion-icon name="search-outline"></ion-icon>
    </div>
  );
}

export default Search;
