import React, { useState } from 'react';
import './Search.css';

function Search({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log("QUERY to send: ", query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Search;
