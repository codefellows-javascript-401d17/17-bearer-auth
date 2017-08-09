'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('poke:pokemon-router');

const Pokemon = require('../model/pokemon.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const pokemonRouter = module.exports = Router();

pokemonRouter.post('/api/pokemon', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/pokemon');
  
  req.body.userID = req.user._id;
  new Pokemon(req.body).save()
  .then(pokemon => res.json(pokemon))
  .catch(next);
});

pokemonRouter.get('/api/pokemon/:id', bearerAuth, function(req, res, next) {
  debug('GET: /api/pokemon/:id');
  
  Pokemon.findById(req.params.id)
  .then(pokemon => {
    res.json(pokemon);
  })
  .catch(next);
});