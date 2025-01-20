const axios = require('axios');
const Item = require('../models/cardModel');

// Controller method to fetch all items from the database
const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    console.log(items);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

const fetchAndStoreDigimon = async (req, res) => {
    try {
      const baseUrl = 'https://digi-api.com/api/v1/digimon';
      let currentPage = 0;
      let totalPages = 1;
      const allDigimon = [];
  
      while (currentPage < totalPages) {
        // Fetch the current page of data
        const { data } = await axios.get(`${baseUrl}?page=${currentPage}`);
        const { pageable, content } = data;
  
        // Add the current page's Digimon to the list
        const digimonPageData = content.map((digimon) => ({
          id:digimon.id,
          name: digimon.name,
          image: digimon.image,
          href: digimon.href,
        }));
        allDigimon.push(...digimonPageData);
  
        // Update pagination details
        totalPages = pageable.totalPages;
        currentPage++;
      }
  
      // Insert the data into MongoDB (optional: clear existing data)
      await Item.deleteMany(); // Clears existing data
      await Item.insertMany(allDigimon);
  
      res.status(200).json({
        message: 'Successfully fetched and stored all Digimon data! CHECK THE DATABASE',
        data: allDigimon,
      });
    } catch (error) {
      console.error('Error fetching Digimon data:', error);
      res.status(500).json({
        message: 'Error fetching or storing Digimon data',
        error: error.message,
      });
    }
  };

  const getRestOfDigimon = async (req, res) => {
    try {

      const apiResponse = await axios.get("https://digi-api.com/api/v1/digimon");
      const apiTotalElements = apiResponse.data.pageable.totalElements;
  
      const dbTotalElements = await Item.countDocuments();
  
      // Log and compare the totals
      console.log("Total in API:", apiTotalElements);
      console.log("Total in Database:", dbTotalElements);
  
      if (dbTotalElements === apiTotalElements) {
        console.log("The database matches the API total count.");
      } else {
        console.log(
          `Mismatch! API has ${apiTotalElements} items, but the database has ${dbTotalElements}.`
        );

        if(apiTotalElements > dbTotalElements ){
            let difference = apiTotalElements - dbTotalElements;

            for (let i = 0; i < difference; i++) {
                console.log("Iteration number: ", i)
                // HACER QUE agregue lo que falta de la API, por ej: https://digi-api.com/api/v1/digimon/1456 hasta 1460
            }
        }
      }
  
      res.status(200).json({
        message: "Fetch and comparison success!",
        apiTotalElements,
        dbTotalElements,
      });
    } catch (error) {
      console.error("Error fetching Digimon data:", error);
      res.status(500).json({
        message: "Error fetching or comparing Digimon data",
        error: error.message,
      });
    }
  };
  
module.exports = { getItems, fetchAndStoreDigimon, getRestOfDigimon };
