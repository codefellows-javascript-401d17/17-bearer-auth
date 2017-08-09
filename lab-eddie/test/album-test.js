'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const url = `http://localhost:${process.env.PORT}/api`;
const User = require('../model/user.js');
const Album = require('../model/album.js');

const modelUser = {
  userName: 'Satan',
  email: 'Gotohell@666.com',
  passWord: '666666'
};

const modelAlbum = {
  title: 'Spoiled Milk',
  datePublished: new Date()
}

describe('Album Routes Muahahahahaha', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Album.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/album', () => {
    describe('with a valid token and body', function() {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen();
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      it('req body should be an album', done => {
        request.post(`${url}/album`)
        .send(modelAlbum)
        .set({
          Authorization: `Bearer ${this.token}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.title).to.equal(modelAlbum.title);
          expect(res.body.userID).to.equal(this.user._id.toString());
          done();
        });
      })
    });

    describe('With an invalid token', () => {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen();
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      it('Should get a 401 error', done => {
        request.post(`${url}/album`)
        .send(modelAlbum)
        .set({
          Authorization: `Bearer somerandomshit`
        })
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });

    describe('With an invalid body', () => {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen();
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      it('Should get a 400 error', done => {
        request.post(`${url}/album`)
        .send({wrong: 'body'})
        .set({
          Authorization: `Bearer ${this.token}`
        })
        .end((err) => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
  });

  

  describe('GET: /api/album/:id', () => {
    describe('with a valid token and id', function() {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen()
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        modelAlbum.userID = this.user._id.toString();
        new Album(modelAlbum).save()
        .then( album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after( () => {
        delete modelAlbum.userID;
      });

      it('should return an album', done => {
        request.get(`${url}/album/${this.album._id}`)
        .set({
          Authorization: `Bearer ${this.token}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal(modelAlbum.title);
          expect(res.body.userID).to.equal(this.user._id.toString());
          done();
        });
      });
    });

    describe('with a valid intoken', function() {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen()
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        modelAlbum.userID = this.user._id.toString();
        new Album(modelAlbum).save()
        .then( album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after( () => {
        delete modelAlbum.userID;
      });

      it('should return an album', done => {
        request.get(`${url}/album/${this.album._id}`)
        .set({
          Authorization: `Bearer Ilovegarbage`
        })
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });

    describe('with an invalid id', function() {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen()
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        modelAlbum.userID = this.user._id.toString();
        new Album(modelAlbum).save()
        .then( album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after( () => {
        delete modelAlbum.userID;
      });

      it('should return a 404 code', done => {
        request.get(`${url}/album/666666`)
        .set({
          Authorization: `Bearer ${this.token}`
        })
        .end((err) => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT: /api/album/:id', () => {
    describe('with a valid token, id and body', function() {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen()
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        modelAlbum.userID = this.user._id.toString();
        new Album(modelAlbum).save()
        .then( album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after( () => {
        delete modelAlbum.userID;
      });

      it('should return an album with a changed name', done => {
        request.put(`${url}/album/${this.album._id}`)
        .send({title: 'blister puss'})
        .set({
          Authorization: `Bearer ${this.token}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('blister puss');
          expect(res.body.userID).to.equal(this.user._id.toString());
          done();
        });
      });
    });

    describe('with a valid intoken', function() {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen()
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        modelAlbum.userID = this.user._id.toString();
        new Album(modelAlbum).save()
        .then( album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after( () => {
        delete modelAlbum.userID;
      });

      it('should return an album', done => {
        request.put(`${url}/album/${this.album._id}`)
        .send({name: 'Blister Puss'})
        .set({
          Authorization: `Bearer Ilovegarbage`
        })
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });

    describe('with an invalid id', function() {
      before( done => {
        new User(modelUser)
        .generatePasswordHash(modelUser.passWord)
        .then( user => user.save())
        .then( user => {
          this.user = user;
          return user.tokenGen()
        })
        .then( token => {
          this.token = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        modelAlbum.userID = this.user._id.toString();
        new Album(modelAlbum).save()
        .then( album => {
          this.album = album;
          done();
        })
        .catch(done);
      });

      after( () => {
        delete modelAlbum.userID;
      });

      it('should return a 404 code', done => {
        request.put(`${url}/album/666666`)
        .send({name: 'blister puss'})
        .set({
          Authorization: `Bearer ${this.token}`
        })
        .end((err) => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
  });
});