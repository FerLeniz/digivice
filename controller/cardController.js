const Item = require('../models/cardModel');

// Controller method to fetch all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    console.log(items)
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

module.exports = { getItems };
