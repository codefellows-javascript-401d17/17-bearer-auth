'use strict';

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const debug = require('debug')('cfgram:server');

const userRouter = require('./route/user-router.js');
const placeRouter = require('./route/place-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(userRouter);
app.use(placeRouter);
app.use(errors);

app.listen(PORT, () => debug(`app listening on: ${PORT}`));
