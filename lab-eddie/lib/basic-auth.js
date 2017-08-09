'use strict';

const debug = require('debug')('app: basic-auth');
const createError = require('http-errors');

module.exports = function(req, res, next) {
  debug('basic-auth');

  let authHeader = req.headers.authorization;
  if(!authHeader) return next(createError(401, 'Authorization Header'));

  let base64auth = authHeader.split('Basic ')[1];
  if(!base64auth) return next(createError(401, 'Must Enter Username and Password'));

  let utf8auth = new Buffer(base64auth, 'base64').toString();
  let loginfo = utf8auth.split(':');

  
  req.auth = {
    userName: loginfo[0],
    passWord: loginfo[1]
  };

  if(!req.auth.userName) return next(createError(401, 'Username Required'));
  if(!req.auth.passWord) return next(createError(401, 'Password Required'));

  next();
};
