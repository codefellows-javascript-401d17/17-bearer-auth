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

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Contact.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

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

  describe('GET: /api/contact/:id', () => {
    describe('with a valid contact id', () => {
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

      before( done => {
        exampleContact.userID = this.tempUser._id.toString();
        new Contact(exampleContact).save()
        .then( contact => {
          this.tempContact = contact;
          done();
        })
        .catch(done);
      });

      after( () => {
        delete exampleContact.userID;
      });

      it('should return a contact', done => {
        request.get(`${url}/api/contact/${this.tempContact._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.name).equal(exampleContact.name);
          expect(res.status).equal(200);
          done();
        });
      });
    });
  });
});
