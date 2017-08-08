'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Band = require('../model/band.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleruser',
  password: '12345',
  email: 'example@test.com'
};

const exampleBand = {
  name: 'example name',
  genre: 'example genre',
  origin: 'example origin'
};

describe('Band Routes', function() {
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Band.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/band', () => {
    before(done => {
      new User(exampleUser)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    it('should return a band', done => {
      request.post(`${url}/api/band`)
      .send(exampleBand)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.name).to.equal(exampleBand.name);
        expect(res.body.genre).to.equal(exampleBand.genre);
        expect(res.body.year).to.equal(exampleBand.year);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      });
    });
  });

  describe('GET: /api/band/:id', () => {
    before(done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then(user => user.save())
      .then(user => {
        this.thempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    before(done => {
      exampleBand.userID = this.tempUser._id.toString();
      new Band(exampleBand).save()
      .then(band => {
        this.tempBand = band;
        done();
      })
      .catch(done);
    });

    after( () => {
      delete exampleBand.userID;
    });

    it('should return a band', done => {
      request.get(`${url}/api/band/${this.tempBand._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.name).to.equal(exampleBand.name);
        expect(res.body.genre).to.equal(exampleBand.genre);
        expect(res.body.origin).to.equal(exampleBand.origin);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      });
    });
  });
});
