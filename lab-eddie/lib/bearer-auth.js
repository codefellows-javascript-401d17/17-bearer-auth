
'use strict';

const createError = require('http-errors');
const debug = require('debug')('cfgram:bearer-auth-middleware');
const jwt = require('jsonwebtoken');

const User = require('../model/user.js');

module.exports = function(req, res, next) {
  debug('bearer auth');

  var authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'Need an Auth Token'));
  }

  var token = authHeader.split('Bearer ')[1];
  if (!token) {
    return next(createError(401, 'Need a Token'));
  }

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return next(err);

    User.findOne({ findHash: decoded.token })
    .then( user => {
      req.user = user;
      next();
    })
    .catch( err => {
      next(createError(401, err.message))
    })
  });
}