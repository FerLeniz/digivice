const express = require('express');
const { getItems, fetchAndStoreDigimon, getRestOfDigimon, fixDigimonValues, addNewDigimon, deleteDigimon, updateDigimon } = require('../controller/cardController');
const router = express.Router();

// Define a GET route to fetch all items
router.get('/items', getItems);

// Define a GET route to fetch and store Digimon data
router.get('/fetch-digimon', fetchAndStoreDigimon);

// Get the rest of digimon that are not in the database
router.get('/get_last_digimons', getRestOfDigimon);

//Fix values like type that are not on the general digimon API, getting especifically from the digimon id
router.get('/fix_values_in_mongo', fixDigimonValues)

// Method to create a new digimon
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure upload directory and CHECK IF IT OK OR IF I NEED TO MODIFY THE  'dest:'uploads/' part '
router.post('/digimons', upload.single('image'), addNewDigimon)
// Method to delete a digimon
router.delete('/digimons/:id', deleteDigimon)
// Method to update a digimon
router.put('/digimons/:id', upload.single('image'), updateDigimon)

module.exports = router;
