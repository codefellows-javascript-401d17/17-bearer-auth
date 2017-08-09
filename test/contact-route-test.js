'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const User = require('../model/user.js');
const Contact = require('../model/contact.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleContact = {
  name: 'Test Contact',
  dob: '10/12/1984',
  phone: 2065555555,
};

describe('Contact Routes', function() {
  describe('POST: /api/signup', function() {
    describe('with a valid body')
  })
})