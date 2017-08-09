'use strict';

const expect = require('chai').expect;
const Promise = require('bluebird');
const superagent = require('superagent');

const User = require('../model/user.js');
const Place = require('../model/place.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};
const examplePlace = {
  name: 'Seattle',
  desc: 'very cool palce'
};



describe('Place Routes', () => {
  afterEach((done) => {
    Promise.all([
      User.remove({}),
      Place.remove({})
    ])
    .then(() => done())
    .catch(done);
  });

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



  describe('GET: /api/place/:id', () => {
    beforeEach((done) => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then((user) => user.save())
      .then((user) => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then((token) => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });
    beforeEach((done) => {
      examplePlace.userID = this.tempUser._id.toString();
      new Place(examplePlace).save()
      .then((place) => {
        this.tempPlace = place;
        done();
      })
      .catch(done);
    });

    describe('with valid input', () => {
      it('Should return a place', (done) => {
        superagent.get(`${url}/api/place/${this.tempPlace._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with no token', () => {
      it('Should return a status of 401', (done) => {
        superagent.get(`${url}/api/place/${this.tempPlace._id}`)
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });

    describe('with invalid id', () => {
      it('Should return a status of 404', (done) => {
        superagent.get(`${url}/api/place/invalidId`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err) => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });



  describe('PUT: /api/place/:id', () => {
    beforeEach((done) => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then((user) => user.save())
      .then((user) => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then((token) => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });
    beforeEach((done) => {
      examplePlace.userID = this.tempUser._id.toString();
      new Place(examplePlace).save()
      .then((place) => {
        this.tempPlace = place;
        done();
      })
      .catch(done);
    });

    describe('with valid input', () => {
      it('Should update an account', (done) => {
        superagent.put(`${url}/api/place/${this.tempPlace._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send({name: 'new place', desc: 'new desc'})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with no token', () => {
      it('Should return a status of 401', (done) => {
        superagent.put(`${url}/api/place/${this.tempPlace._id}`)
        .send({name: 'new place', desc: 'new desc'})
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });

    describe('with no body', () => {
      it('Should return a status of 400', (done) => {
        superagent.put(`${url}/api/place/${this.tempPlace._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err) => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });

    describe('with invalid id', () => {
      it('Should return a status of 404', (done) => {
        superagent.put(`${url}/api/place/invalidId`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send({name: 'new place', desc: 'new desc'})
        .end((err) => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });



  describe('POST: /api/place', () => {
    beforeEach((done) => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then((user) => user.save())
      .then((user) => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then((token) => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });
    // TODO: things
    describe('with valid input', () => {
      it('Should return a token', (done) => {
        superagent.post(`${url}/api/place`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(examplePlace)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with no body', () => {
      it('Should return a 400 error', (done) => {
        superagent.post(`${url}/api/place`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err) => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });

    describe('with no token', () => {
      it('Should return a 401 error', (done) => {
        superagent.post(`${url}/api/place`)
        .send(examplePlace)
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });
  });



  describe('DELETE: /api/place/:id', () => {
    beforeEach((done) => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then((user) => user.save())
      .then((user) => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then((token) => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });
    beforeEach((done) => {
      examplePlace.userID = this.tempUser._id.toString();
      new Place(examplePlace).save()
      .then((place) => {
        this.tempPlace = place;
        done();
      })
      .catch(done);
    });
    // TODO: things
    describe('with valid input', () => {
      it('Should remove a place', (done) => {
        superagent.delete(`${url}/api/place/${this.tempPlace._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});
