'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const User = require('../model/user.js');
const Contact = require('../model/contact.js');
const Promise = require('bluebird');

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
  describe('POST: /api/contact', function() {
    describe('with a valid body', function() {
      before( done => {
        let user = new User(exampleUser);

        user.generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          User.remove({}),
          Contact.remove({})
        ])
        .then( () => done())
        .catch(done);
      });

      it('should return a contact', done => {
        request.post(`${url}/api/contact`)
        .send(exampleContact)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).equal(200);
          done();
        });
      });
    });
  });
});
