'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const User = require('../model/user.js');
const Purchase = require('../model/purchase.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const examplePurchase = {
  name: 'test purchase',
  product: 'super lemon haze'
};

describe('Purchase Routes', function(){
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Purchase.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/purchase', () => {
    before(done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    it('should return a purchase', done =>{
      request.post(`${url}/api/purchase`)
      .send(examplePurchase)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        let sold = new Date(res.body.sold).toString();
        expect(res.body.name).to.equal(examplePurchase.name);
        expect(res.body.product).to.equal(examplePurchase.product);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(sold).to.not.equal('Invalid Date');
        done();
      });
    });
  });

  describe('GET: /api/purchase/:id', function() {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then (user => {
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
      examplePurchase.userID = this.tempUser._id.toString();
      new Purchase(examplePurchase).save()
      .then (purchase=> {
        this.tempPurchase = purchase;
        done();
      })
      .catch(done);
    });

    after( () => {
      delete examplePurchase.userID;
    });

    it('should return a purchase', done => {
      request.get(`${url}/api/purchase/${this.tempPurchase._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.body.name).to.equal(examplePurchase.name);
        expect(res.body.desc).to.equal(examplePurchase.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        done();
      });
    });
  });
});
