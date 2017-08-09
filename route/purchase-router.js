'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:galery-router');

const Purchase= require('../model/purchase.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const purchaseRouter = module.exports = Router();

purchaseRouter.post('/api/purchase', bearerAuth, jsonParser, function(req, res, next){
  debug('POST to /api/purchase');

  req.body.userID = req.user._id;
  new Purchase(req.body).save()
  .then( purchase => res.json(purchase))
  .catch(next);
});

purchaseRouter.get('/api/purchase/:id', bearerAuth, jsonParser, function(req, res, next){
  debug('GET: /api/purchases/:id')

  Purchase.findById(req.params.id)
  .then( purchase => {
    res.json(purchase);
  })
  .catch(next);
});
