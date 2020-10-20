
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({}, {strict: false});

const cardData = module.exports = mongoose.model('card_data', cardSchema)