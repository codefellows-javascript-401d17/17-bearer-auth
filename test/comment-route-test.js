'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const User = require('../model/user.js');
const Comment = require('../model/comment.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
    username: 'exampleUser',
    password: '1234',
    email: 'exampleuser@test.com'
}

const exampleComment = {
    name: 'test comment',
    desc: 'test comment description'
}

describe('Comment Routes', function() {
    afterEach(done => {
        Promise.all([
                User.remove({}),
                Comment.remove({})
            ])
            .then(() => done())
            .catch(done);
    });

    describe('POST: /api/comment', () => {
        before(done => {
            new User(exampleUser)
                .generatePasswordHash(exampleUser.password)
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

        it('should return a comment', done => {
            request.post(`${url}/api/comment`)
                .send(exampleComment)
                .set({
                    Authorization: `Bearer ${this.tempToken}`
                })
                .end((err, res) => {
                    if (err) return done(err);
                    let date = new Date(res.body.created).toString();
                    expect(res.body.name).to.equal(exampleComment.name);
                    expect(res.body.desc).to.equal(exampleComment.desc);
                    expect(res.body.userID).to.equal(this.tempUser._id.toString());
                    expect(date).to.not.equal('Invalid Date');
                    done();
                });
        });

        it('should return a 401', done => {
            request.post(`${url}/api/comment`)
                .send(exampleComment)
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        });

        it('should return a 400', done => {
            request.post(`${url}/api/comment`)
                .send({ name: 'shark', desc: 'black' })
                .set({
                    Authorization: `Bearer ${this.tempToken}`
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });

    describe('GET: /api/comment/:id', () => {
        before(done => {
            new User(exampleUser)
                .generatePasswordHash(exampleUser.password)
                .then(user => user.save())
                .then(user => {
                    this.tempUser = user;
                    return user.generateToken()
                })
                .then(token => {
                    this.tempToken = token;
                    done();
                })
                .catch(done);
        });

        before(done => {
            exampleComment.userID = this.tempUser._id.toString();
            new Comment(exampleComment).save()
                .then(comment => {
                    this.tempComment = comment;
                    done();
                })
                .catch(done);
        });

        after(() => {
            delete exampleComment.userID;
        });

        it('should return a comment', done => {
            request.get(`${url}/api/comment/${this.tempComment._id}`)
                .set({
                    Authorization: `Bearer ${this.tempToken}`
                })
                .end((err, res) => {
                    if (err) return done(err);
                    let date = new Date(res.body.created).toString();
                    expect(res.body.name).to.equal(exampleComment.name);
                    expect(res.body.desc).to.equal(exampleComment.desc);
                    expect(res.body.userID).to.equal(this.tempUser._id.toString());
                    expect(date).to.not.equal('Invalid Date');
                    done();
                });
        });

        it('should return a 404', done => {
            request.get(`${url}/api/comment/${this.tempComment._id}`)
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        });
    });

    describe('PUT: /api/comment/:id', function() {
        beforeEach(done => {
            new User(exampleUser)
                .generatePasswordHash(exampleUser.password)
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

        beforeEach(done => {
            exampleComment.userID = this.tempUser._id.toString();
            new Comment(exampleComment).save()
                .then(comment => {
                    this.tempComment = comment;
                    done();
                })
                .catch(done);
        });

        after(() => {
            delete exampleComment.userID;
        });

        it('should return a comment', done => {
            request.put(`${url}/api/comment/${this.tempComment._id}`)
                .send({ name: 'fake name' })
                .set({
                    Authorization: `Bearer ${this.tempToken}`
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body.name).to.equal('fake name');
                    done();
                });
        });

        it('should return a 404', done => {
            request.put(`${url}/api/comment`)
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    done();
                });
        });

        it('should return a 401', done => {
            request.put(`${url}/api/comment/${this.tempComment._id}`)
                .end((err, res) => {
                    expect(res.status).to.equal(401);
                    done();
                });
        });

        it('should return a 400', done => {
            request.post(`${url}/api/comment`)
                .send({ name: 'aahaha', desc: 'wahgwan' })
                .set({
                    Authorization: `Bearer ${this.tempToken}`
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    done();
                });
        });
    });
});