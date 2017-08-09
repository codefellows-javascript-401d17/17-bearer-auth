const Router = require('express').Router;
const debug = require('debug')('anki:deck-router.js');
const jsonParser = require('body-parser').json();
const bearerAuthorization = require('../lib/bearer-auth-middleware');
const Deck = require('../model/deck');
const createError = require('http-errors');

const deckRouter = module.exports = new Router();

deckRouter.post('/api/deck', bearerAuthorization, jsonParser, function (req, rsp, next) {
  debug('POST /api/deck');
  req.body.userID = req.user._id; //see bearerAuthr middleware, attaches it 
  Deck.create(req.body)
    .then((deck) => {
      rsp.json(deck);
    })
    .catch((err) => {
      next(err);
    })
})

deckRouter.get('/api/deck/:id', bearerAuthorization, function (req, rsp, next) {
  debug('GET /api/deck/:id')

  Deck.findById(req.params.id)
    .then((deck) => {
      rsp.json(deck);
    })
    .catch((err) => {
      next(err);
    })
})

deckRouter.put('/api/deck/:id', bearerAuthorization, jsonParser, function (req, rsp, next) {
  debug('PUT /api/deck/:id');
  if (Object.keys(req.body).length === 0) return next(createError(400));
  Deck.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((deck) => {
      rsp.json(deck);
    })
    .catch((err) => {
      next(err);
    })
})

deckRouter.delete('/api/deck/:id', bearerAuthorization, jsonParser, function (req, rsp, next) {
  debug('DELETE /api/deck/:id');
  if(!req.params.id) return next(createError(400));
  
  Deck.findByIdAndRemove(req.params.id)
    .then(() => {
      rsp.sendStatus(201);
    })
    .catch((err) => {
      next(err);
    })
})