'use strict';

const createError = require('http-errors');
const debug = require('debug')('basic-authentication-server:basic-authentication');

let basicAuthentication = function(request, response, next) {
  debug('basicAuthentication');

  let authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    let error = createError(401, 'authorization header required');
    return next(error);
  }

  let base64String = authorizationHeader.split('Basic ')[1];

  if (!base64String) {
    let error = createError(401, 'authorization credentials required.');
    return next(error);
  }

  let utf8String = new Buffer(base64String, 'base64').toString();
  let credentialArray = utf8String.split(':');

  request.authorization = {
    username: credentialArray[0],
    password: credentialArray[1]
  };

  if (!request.authorization.username) {
    let error = createError(401, 'username required');
    return next(error);
  }

  if (!request.authorization.password) {
    let error = createError(401, 'password required');
    return next(error);
  }

  next();
}

module.exports = basicAuthentication;