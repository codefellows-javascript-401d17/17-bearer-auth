'use strict';'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const creatError = require('http-errors');
const debug = require('debug')('app: auth-route');
const basicAuth = require('../lib/basic-auth.js');
const User = require('../model/user.js');

const authRoute = new Router();

authRoute.post('/api/newuser', jsonParser, function(req, res, next) {
  debug('POST /api/newuser');

  let passWord = req.body.passWord;
  delete req.body.passWord;


  let user = new User(req.body);

  user.generatePasswordHash(passWord)
  .then(user => user.save())
  .then(user => user.tokenGen())
  .then(token => res.send(token))
  .catch(err => next(creatError(400, err.message)));

});

authRoute.get('/api/signin',basicAuth , function(req, res, next) {
  debug('GET /api/signin');

  User.findOne({userName: req.auth.userName})
  .then(user => user.confirmPass(req.auth.passWord))
  .then(user => user.tokenGen())
  .then(token => res.send(token))
  .catch(next);
});

module.exports = authRoute;