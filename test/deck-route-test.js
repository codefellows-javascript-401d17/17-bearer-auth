const request = require('superagent');
const expect = require('chai').expect;
const User = require('../model/user.js');
const Deck = require('../model/deck.js');
const Promise = require('bluebird');
const url = `http://localhost:${process.env.PORT}`;
const mongoose = require('mongoose');

const exampleUserBody = {
  username: 'exampleUser',
  password: '12345',
  email: 'exampleuser@gmail.com'
}

const exampleDeckBody = {
  name: 'Esperanto',
};

describe('Deck Routes', function () {
  afterEach((done) => {
    Promise.all([
      User.remove(),
      Deck.remove()
    ])
      .then(() => { done() })
      .catch(done);
  });
  describe('POST /api/deck', function () {
    describe('provided a valid body', function () {
      //before: create a tempToken
      before((done) => {
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password) //from User model
          .then(user => {
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      it('should return a deck', (done) => {
        request.post(`${url}/api/deck`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .send(exampleDeckBody)
          .end((err, rsp) => {
            if (err) console.error(err);
            expect(rsp.body.name).to.equal(exampleDeckBody.name);
            expect(rsp.status).to.equal(200);
            done();
          })
      })
    })
    describe('provided an invalid body', function () {
      before((done) => {
        //user > user w/pass > token > tempToken
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password)
          .then((user) => {
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      it('should return a 400 error', (done) => {
        request.post(`${url}/api/deck`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .send({ notvalid: 'hahahaha' })
          .end((err, rsp) => {
            expect(rsp.status).to.equal(400);
            done();
          })
      })
    })
    describe('when request made with absent token', function () {
      it('responds with a 401 error', (done) => {
        request.post(`${url}/api/deck`)
          .send(exampleDeckBody)
          .end((err, rsp) => {
            expect(rsp.status).to.equal(401);
            done();
          })
      })
    })
  });
  describe('GET /api/deck/:id', function () {
    describe('when provided a valid id', function () {
      before((done) => {
        //saves hash-completed user document to collection
        //user doc > tempToken
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password)
          .then((userBody) => {
            return User.create(userBody);
          })
          .then((user) => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
      })
      before((done) => {
        //add userID-complete deck to db, attach tempDeck to context
        exampleDeckBody.userID = this.tempUser._id.toString();
        Deck.create(exampleDeckBody)
          .then((deck) => {
            this.storedDeck = deck;
            done();
          })
          .catch((err) => {
            console.error(err);
            done();
          })

      })
      it('responds with a deck', (done) => {
        request.get(`${url}/api/deck/${this.storedDeck._id}`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end((err, rsp) => {
            expect(rsp.body.name).to.equal('Esperanto');
            expect(rsp.status).to.equal(200);
            done();
          })
      })
    })
    describe('when provided no token', function () {
      //saves hash-completed user document to collection
      //user doc > tempToken
      before((done) => {
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password)
          .then((userBody) => {
            return User.create(userBody);
          })
          .then((user) => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
          .catch((err) => {
            next(err);
          })
      })
      //create userID-complete deck, add to db, attach deck to context
      before((done) => {
        exampleDeckBody.userID = this.tempUser._id.toString();
        Deck.create(exampleDeckBody)
          .then((deck) => {
            this.storedDeck = deck;
            done();
          })
          .catch((err) => {
            next(err);
          })
      })
      it('responds with a 401 error', (done) => {
        request.get(`${url}/api/deck/${this.storedDeck._id}`)
          .end((err, rsp) => {
            expect(rsp.status).to.equal(401);
            done();
          })

      })
    })
  })
  describe('PUT /api/deck/:id', function () {
    //get user tempToken and a tempDeck
    describe('when provided a valid id and body', function () {
      before((done) => {
        //create a hash-complete user, user doc > tempToken
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password)
          .then((user) => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      before((done) => {
        //create a userID-completed deck to db, attach storedDeck to context
        exampleDeckBody.userID = this.tempUser._id;
        Deck.create(exampleDeckBody)
          .then((deck) => {
            this.storedDeck = deck;
            done();
          })
          .catch((err) => {
            next(err);
          })
      })
      it('should return a deck when provided a valid :id and body', (done) => {
        var updateDeckBody = { name: 'Biology' };
        request.put(`${url}/api/deck/${this.storedDeck._id}`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .send(updateDeckBody)
          .end((err, rsp) => {
            if (err) console.error(err);
            expect(rsp.status).to.equal(200);
            expect(rsp.body.name).to.equal('Biology');
            done();
          })
      })
    })
    describe('provided no token', function () {
      before((done) => {
        //create a hash-complete user, user doc > tempToken
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password)
          .then((user) => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      before((done) => {
        //create a userID-completed deck to db, attach storedDeck to context
        exampleDeckBody.userID = this.tempUser._id;
        Deck.create(exampleDeckBody)
          .then((deck) => {
            this.storedDeck = deck;
            done();
          })
          .catch((err) => {
            next(err);
          })
      })
      it('responds with a 401 error', (done) => {
        var updateDeckBody = { name: 'Biology' };
        request.put(`${url}/api/deck/${this.storedDeck._id}`)
          .send(updateDeckBody)
          .end((err, rsp) => {
            expect(rsp.status).to.equal(401);
            done()
          })
      })
    })
    describe('provided an invalid body', function () {
      before((done) => {
        //create a hash-complete user, user doc > tempToken
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password)
          .then((user) => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      before((done) => {
        //create a userID-completed deck to db, attach storedDeck to context
        exampleDeckBody.userID = this.tempUser._id;
        Deck.create(exampleDeckBody)
          .then((deck) => {
            this.storedDeck = deck;
            done();
          })
          .catch((err) => {
            next(err);
          })
      })
      it('responds with a 400 error', (done) => {
        const updateDeckBody = {};
        request.put(`${url}/api/deck/${this.storedDeck._id}`)
          .send(updateDeckBody)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end((err, rsp) => {
            expect(rsp.status).to.equal(400);
            done();
          })
      })
    })
  })
  describe('DELETE /api/deck/:id', function () {
    describe('when provided a valid id', function () {
      before((done) => {
        //create a hash-complete user, user doc > tempToken
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password)
          .then((user) => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      before((done) => {
        //create a userID-completed deck to db, attach storedDeck to context
        exampleDeckBody.userID = this.tempUser._id;
        Deck.create(exampleDeckBody)
          .then((deck) => {
            this.storedDeck = deck;
            done();
          })
          .catch((err) => {
            next(err);
          })
      })
      it('responds with a 201 response', (done) => {
        request.delete(`${url}/api/deck/${this.storedDeck._id}`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end((err, rsp) => {
            expect(rsp.status).to.equal(201);
            done();
          })

      })
    })
    describe('not provided a valid token', function () {
      before((done) => {
        //create a hash-complete user, user doc > tempToken
        new User(exampleUserBody)
          .generatePasswordHash(exampleUserBody.password)
          .then((user) => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then((token) => {
            this.tempToken = token;
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
      before((done) => {
        //create a userID-completed deck to db, attach storedDeck to context
        exampleDeckBody.userID = this.tempUser._id;
        Deck.create(exampleDeckBody)
          .then((deck) => {
            this.storedDeck = deck;
            done();
          })
          .catch((err) => {
            next(err);
          })
      })
      it('responds with a 401 error', (done) => {
        request.delete(`${url}/api/deck/${this.storedDeck._id}`)
          .end((err, rsp) => {
            expect(rsp.status).to.equal(401);
            done();
          })
      })
    })
  })
})
