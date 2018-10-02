'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Customer } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

/*
router.('/', jsonParser, (req,res) => {

});
*/


module.export = { router };