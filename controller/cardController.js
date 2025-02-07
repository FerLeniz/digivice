const axios = require('axios');
const DigimonCard = require('../models/cardModel');
const fs = require('fs');
const path = require('path');

// Controller method to fetch all items from the database
const getItems = async (req, res) => {
    try {
        const items = await DigimonCard.find().sort({ _id: -1 });
        //const items = await DigimonCard.find().sort({ _id: -1 }).limit(1); // get just the last one
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
        await DigimonCard.deleteMany();
        await DigimonCard.insertMany(allDigimon);

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

        const dbTotalElements = await DigimonCard.countDocuments();

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
                    const insertedItem = await DigimonCard.create(newDigimon);
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

        const digimon = await DigimonCard.find({
            $or: [
                { type: { $exists: false } },
                { level: { $exists: false } },
                { attribute: { $exists: false } },
            ],
        });

        // Extract the `id` property from each document
        const digimonIds = digimon.map((d) => d.id);

        for (const digimon of digimonIds) {
            const { data } = await axios.get(`https://digi-api.com/api/v1/digimon/${digimon}`);

            // Construct the Digimon document
            const newAttributes = {
                type: data.types && data.types[0] ? data.types[0].type : null,
                level: data.levels && data.levels[0] ? data.levels[0].level : null,
                attribute: data.attributes && data.attributes[0] ? data.attributes[0].attribute : null,
            };

            // Update the document in MongoDB
            await DigimonCard.updateOne(
                { id: digimon },
                { $set: newAttributes }
            );

            console.log('last update number: ', digimon)
        }

        res.status(200).json({
            message: "digimon from MONGO",
        });

    } catch (error) {
        console.error("Error fetching Digimon data:", error);
        res.status(500).json({
            message: "Error fetching or comparing Digimon data",
            error: error.message,
        });
    }
}

const addNewDigimon = async (req, res) => {
    try {
        const { name, attribute, level, type } = req.body;
        //const image = req.file ?  `http://localhost:3001/uploads/${req.file.originalname}` : null;
        let image = null;

        if (req.file) {
            const oldPath = req.file.path; // Multer saves it with a random name
            const newFilename = req.file.originalname; // Use original filename
            const newPath = path.join('uploads', newFilename);

            // Rename the file
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                    return res.status(500).json({ message: 'Error processing file' });
                }
            });

            image = `http://localhost:3001/uploads/${newFilename}`;
        }

        const newDigimon = new DigimonCard({
            name,
            attribute,
            level,
            type,
            image,
        });

        const savedDigimon = await newDigimon.save();
        res.status(201).json(savedDigimon);
    } catch (error) {
        console.error('Error adding Digimon:', error);
        res.status(500).json({ message: 'Failed to add Digimon' });
    }
};

const deleteDigimon = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDigimon = await DigimonCard.findByIdAndDelete(id);

        if (!deletedDigimon) {
            return res.status(404).json({ message: "Digimon not found" });
        }

        res.json({ message: "Digimon deleted successfully", deletedDigimon });
    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ message: "Error deleting Digimon", error });
    }
};

const updateDigimon = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, attribute, level, type } = req.body;

        let updatedData = { name, attribute, level, type };

        // If a new image is uploaded, update it
        if (req.file) {
            const oldPath = req.file.path;
            const newFilename = req.file.originalname;
            const newPath = path.join('uploads', newFilename);

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                    return res.status(500).json({ message: 'Error processing file' });
                }
            });

            updatedData.image = `http://localhost:3001/uploads/${newFilename}`;
        }

        const updatedDigimon = await DigimonCard.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedDigimon) {
            return res.status(404).json({ message: 'Digimon not found' });
        }

        res.status(200).json(updatedDigimon);
    } catch (error) {
        console.error('Error updating Digimon:', error);
        res.status(500).json({ message: 'Failed to update Digimon' });
    }
};

module.exports = { getItems, fetchAndStoreDigimon, getRestOfDigimon, fixDigimonValues, addNewDigimon, deleteDigimon, updateDigimon};
