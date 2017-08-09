'use strict';

const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const Router = require('express').Router;
const debug = require('debug')('cfgram:place-router');

const Place = require('../model/place.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const placeRouter = module.exports = Router();

placeRouter.get('/api/place/:id', bearerAuth, (req, res, next) => {
  debug('GET: /api/place/:id');

  if(!req.params.id) next(createError(400, 'id required'));

  Place.findById(req.params.id)
  .then((place) => {
    res.json(place);
  })
  .catch(() => next(createError(404, 'not found')));
});

placeRouter.put('/api/place/:id', bearerAuth, jsonParser, (req, res, next) => {
  debug('PUT: /api/place/:id');

  if(!req.params.id) next(createError(400, 'id required'));
  if(!req.body.name) next(createError(400, 'name required'));
  if(!req.body.desc) next(createError(400, 'description required'));

  Place.findById(req.params.id)
  .then((place) => {
    place.name = req.body.name;
    place.desc = req.body.desc;
    res.json(place);
  })
  .catch(() => next(createError(404, 'not found')));
});

placeRouter.post('/api/place', bearerAuth, jsonParser, (req, res, next) => {
  debug('POST: /api/place');

  if(!req.body.userID) next(createError(400, 'id required'));

  req.body.userID = req.user._id;
  new Place(req.body).save()
  .then((place) => res.json(place))
  .catch(() => next(createError(404, 'not found')));
});

placeRouter.delete('/api/place/:id', bearerAuth, (req, res, next) => {
  debug('DELETE: /api/place/:id');
  Place.findById(req.params.id)
  .then((place) => {
    Place.remove({'_id': place._id});
    console.log(place);
  })
  .catch(() => next(createError(404, 'not found')));
});
