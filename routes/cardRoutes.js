const express = require('express');
const { getItems } = require('../controller/cardController'); 
const router = express.Router();

// Define a GET route to fetch all items
router.get('/items', getItems);

module.exports = router;
