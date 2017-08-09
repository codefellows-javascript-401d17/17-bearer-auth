'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../model/user.js')
require('../server.js');

const url = `http://localhost:${process.env.PORT}/api`;

const modelUser = {
  userName: 'Satan',
  email: 'Gotohell@666.com',
  passWord: '666666'
};

describe('Authentication Routes for lab', function() {
  describe('POST /api/newuser', function() {
    describe('With a proper body', function() {

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      })

      it('Return a 200 code', done => {
        request.post(`${url}/newuser`)
        .send(modelUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    })
    describe('With an improper body', function() {

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      })

      it('Return  a 400 code', done => {
        request.post(`${url}/newuser`)
        .send({random: 'crap'})
        .end((err) => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    })
  })
  describe('GET /api/signin', function() {
    describe('With a proper username', function() {
      before(done => {
        let user = new User(modelUser);
        user.generatePasswordHash(user.passWord)
        .then(user => user.save())
        .then(user => {
          this.user = user;
          done();
        })
        .catch(done)
      });

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      })

      it('Return a 200 code', done => {
        request.get(`${url}/signin`)
        .auth('Satan', '666666')
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    })
    describe('With an invalid password username', function() {
      before(done => {
        let user = new User(modelUser);
        user.generatePasswordHash(user.passWord)
        .then(user => user.save())
        .then(user => {
          this.user = user;
          done();
        })
        .catch(done)
      });

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      })

      it('Return a 401 code', done => {
        request.get(`${url}/signin`)
        .auth('Satan', 'Spoiled milk? More like fresh yogurt!!')
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    })
  })
})