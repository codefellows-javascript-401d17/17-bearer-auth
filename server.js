'use strict';

const express = require('express');
const debug = require('debug')('purchases:server');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./route/auth-router.js');
const purchaseRouter = require('./route/purchase-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(purchaseRouter);
app.use(errors);

app.listen(PORT, () =>  {
  debug(`currently listening on: ${PORT}`);
});
