'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');
const User = require('../model/user.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

describe('User Routes', () => {
  describe('bad route', () => {
    it('Should return a 404 error', (done) => {
      superagent.post(`${url}/not/a/route`)
      .send(exampleUser)
      .end((err) => {
        expect(err.status).to.equal(404);
        done();
      });
    });
  });

  describe('POST: /api/signup', () => {
    describe('with no body', () => {
      it('Should return a 400 error', (done) => {
        superagent.post(`${url}/api/signup`)
        .send({})
        .end((err) => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });

    describe('with a valid body', () => {
      after((done) => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      it('Should return a token', (done) => {
        superagent.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', () => {
    describe('with a invalid password', () => {
      before((done) => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then((user) => user.save())
        .then((user) => {
          this.tempUser = user;
          done();
        });
      });
      after((done) => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      it('Should return a token', (done) => {
        superagent.get(`${url}/api/signin`)
        .auth('exampleuser', 'invalid')
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });

    describe('with a valid body', () => {
      before((done) => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then((user) => user.save())
        .then((user) => {
          this.tempUser = user;
          done();
        });
      });
      after((done) => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      it('Should return a token', (done) => {
        superagent.get(`${url}/api/signin`)
        .auth('exampleuser', '1234')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});
