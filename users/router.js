'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req,res) => {
    const requiredFields = ['username','password','client'];
    const missedFields = requiredFields.find(field => !(field in req.body));

    if (missedFields) {
        return res.status(422).json({
            code: 422,
            reason: 'Error Validating',
            message: 'Missing user field',
            location: missedFields
        });
    }

    const stringFields = ['username', 'password', 'firstName', 'lastName','client'];
    const stringValidation = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');




})






module.exports = { router };
