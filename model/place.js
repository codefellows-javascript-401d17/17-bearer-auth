'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('cfgram:place');

const placeSchema = Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  created: {type: Date, required: true, default: Date.now},
  userID: {type: Schema.Types.ObjectId, required: true}
});

debug('placeSchema');
module.exports = mongoose.model('place', placeSchema);
