'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose =  require('mongoose');
const dotenv = require('dotenv');
const debug = require('debug')('app: server');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug('Server Active: ', PORT);
});