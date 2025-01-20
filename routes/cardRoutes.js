const express = require('express');
const { getItems,fetchAndStoreDigimon ,getRestOfDigimon } = require('../controller/cardController'); 
const router = express.Router();

// Define a GET route to fetch all items
router.get('/items', getItems);

// Define a GET route to fetch and store Digimon data
router.get('/fetch-digimon', fetchAndStoreDigimon);

router.get('/get_last_digimons', getRestOfDigimon)

module.exports = router;
