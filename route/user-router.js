'use strict';

const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const Router = require('express').Router;
const debug = require('debug')('cfgram:auth-router');

const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');

const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  debug('POST: /api/signup');

  if(!req.body.password) next(createError(400, 'password required'));
  if(!req.body.username) next(createError(400, 'username required'));
  if(!req.body.email) next(createError(400, 'email required'));

  let password = req.body.password;
  delete req.body.password;
  let user = new User(req.body);

  user.generatePasswordHash(password)
  .then((user) => user.save())
  .then((user) => user.generateToken())
  .then((token) => res.send(token))
  .catch(next);
});

authRouter.get('/api/signin', basicAuth, (req, res, next) => {
  debug('GET: /api/signin');

  if(!req.auth.username) return createError(400, 'username required');

  User.findOne({ username: req.auth.username })
  .then((user) => user.comparePasswordHash(req.auth.password))
  .then((user) => user.generateToken())
  .then((token) => res.send(token))
  .catch(next);
});
