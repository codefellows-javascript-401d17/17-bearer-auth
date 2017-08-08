'use strict';

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('basic-authorization-server:server');
const errors = require('./middleware/errors.js');
const basicAuthenticationRouter = require('./route/basic-authentication-router.js');

const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(basicAuthenticationRouter);
app.use(errors);

app.listen(process.env.PORT, function() {
  debug(`Listening on port ${process.env.PORT}.`);
});