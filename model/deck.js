'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('anki:deck.js');



const deckSchema = Schema({
  name: { type: String, required: true },
  updated: { type: Date, required: true, default: Date.now},
  userID: { type: Schema.Types.ObjectId, required: true }
})

module.exports = mongoose.model('deck', deckSchema);