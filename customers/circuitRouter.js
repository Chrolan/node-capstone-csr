'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Circuit } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();









module.exports = { router };