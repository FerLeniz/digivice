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
                id: digimon.id,
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
        await Item.deleteMany();
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

//FUNCTION TO CHECK DIFFERENCE BETWEEN API AND DATABASE:
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

            if (apiTotalElements >= dbTotalElements) {
                let difference = apiTotalElements - dbTotalElements;

                for (let i = 1; i <= difference; i++) {
                    let newIdDigimon = dbTotalElements + i

                    const { data } = await axios.get(`https://digi-api.com/api/v1/digimon/${newIdDigimon}`);

                    // Construct the Digimon document
                    const newDigimon = {
                        id: data.id,
                        name: data.name,
                        href: `https://digi-api.com/api/v1/digimon/${newIdDigimon}`,
                        image: data.images && data.images[0] ? data.images[0].href : null,
                        type: data.types && data.types[0] ? data.types[0].type : null,
                        level: data.levels && data.levels[0] ? data.levels[0].level : null,
                        attribute: data.attributes && data.attributes[0] ? data.attributes[0].attribute : null
                    };

                    // Insert the new Digimon into the database
                    const insertedItem = await Item.create(newDigimon);
                    console.log("Inserted item:", insertedItem);
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

// Function to add the values that are not in the digimon, like type, level,etc..
const fixDigimonValues = async (req, res) => {
    try {
        const { data } = await axios.get("https://digi-api.com/api/v1/digimon/1460")
    } catch (error) {
        console.error("Error fetching Digimon data:", error);
        res.status(500).json({
            message: "Error fetching or comparing Digimon data",
            error: error.message,
        });
    }
}

module.exports = { getItems, fetchAndStoreDigimon, getRestOfDigimon };
