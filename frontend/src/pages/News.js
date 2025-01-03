// src/pages/News.js
//import React from 'react';

//function News() {
//  return <h2>News</h2>;
//}

//export default News;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you have axios installed in your React project

const News = () => {
  const [dittoData, setDittoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto");//'/api/ditto'); // Assuming Node.js server at localhost:3000
        setDittoData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading Ditto data...</p>}
      {error && <p>Error: {error}</p>}
      {dittoData && (
        <>
          <h2>Ditto Details</h2>
          <p>Name: {dittoData.name}</p>
          {/* Access other properties from dittoData (e.g., abilities, height) */}
        </>
      )}
    </div>
  );
};

export default News;