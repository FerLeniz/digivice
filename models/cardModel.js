const mongoose = require('mongoose');

// Define a schema for your "Item" collection
const cardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    level: { type: String, required: true },
    attribute: { type: String, required: true },
    image: { type: String },
    href: { type: String },
    id: { type: Number },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

// Create a model using the schema
const DigimonCard = mongoose.model('Digimon', cardSchema);

module.exports = DigimonCard;
