'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:profile-router');

const Profile = require('../model/profile.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();

profileRouter.post('/api/profile', bearerAuth, jsonParser, function (req, res, next) {
  debug('POST: /api/profile');

  req.body.userID = req.user._id;
  new Profile(req.body).save()
    .then(profile => res.json(profile))
    .catch(next);
});

profileRouter.get('/api/profile/:id', bearerAuth, function (req, res, next) {
  debug('GET: /api/profile/:id');

  Profile.findById(req.params.id)
    .then(profile => {
      res.json(profile);
    })
    .catch(next);
});

profileRouter.put('/api/profile/:id', bearerAuth, jsonParser, function (req, res, next) {
  debug('PUT: /api/profile/:id');

  Profile.findByIdAndUpdate(req.params.id, req.body, { 'new': true })
    .then(profile => res.json(profile))
    .catch(err => {
      if (err.name === 'ValidationError') return next(err);
      next();
    });
});

profileRouter.delete('/api/profile/:id', bearerAuth, function (req, res, next) {
  debug('DELETE: /api/profile/:id');

  Profile.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).send())
    .catch(next);
});