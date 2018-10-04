'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

router.get('/', jsonParser, (req,res) => {
   User.findOne()
       .then(user => res.json(user))
       .catch(err => {
           console.log(err);
           res.status(500).json({message:'Internal Server Error'})
       })
});

router.post('/', jsonParser, (req,res) => {

    const essentialFields =  ['username', 'password', 'firstName', 'lastName','email','client'];

    const missedFields = essentialFields.find(field => !(field in req.body));

    if (missedFields) {
        return res.status(422).json({
            code: 422,
            reason: 'Error Validating',
            message: 'Missing user field',
            location: missedFields
        });
    }

    const stringValidation = essentialFields.find(field => field in req.body && typeof req.body[field] !== 'string');

    if (stringValidation) {
        return res.status(422).json ({
            code: 422,
            reason: 'Error Validating',
            message: 'Expected string in input',
            location: stringValidation
        });
    }

    const nonTrimmedField = essentialFields.find(field => req.body[field].trim() !== req.body[field]);

    if (nonTrimmedField) {
        return res.status(422).json({
          code: 422,
          reason: 'ValidationError',
          message: 'Cannot start or end with whitespace',
          location: nonTrimmedField
        });
  }

  const sizedFields = {
    username: {
      min: 1,
        max: 20
    },
    password: {
      min: 10,
      max: 25
    }
  };

    const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { username, password, firstName, lastName, email, client} = req.body;

  return User.find({username})
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName,
        email,
        client
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

router.delete('/', jsonParser,(req,res) => {

    let { username, client } = req.body;
    console.log(username, client);

    User.findOne({username,client})
        .then(user => {
            console.log(user);
            if(user != null && Object.keys(user).length > 0) {
                User.deleteOne(user)
                    .then(res.status(202).json({message: 'Success'}))
                    .catch(err => {
                            console.log(err);
                            res.status(500).json({message: 'Error deleting user'})
                        })
            }
            else {
                res.status(500).json({message: 'User not found'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Error in request'})
        })
});

module.exports = { router };
