'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Circuit } = require('./models');
const { Device } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();


//General circuit query, will allow passed parameters.
router.get('/circuit/', jsonParser, (req,res) => {

    const filters = {};
    const queryFields = ['circuitId','zLocationDevice.deviceInfo.device','zLocationDevice.deviceInfo.device','aLocationDevice.deviceInfo.devicePort','aLocationDevice.deviceInfo.devicePort'];

    //appends fields to filters object, which is later used by Circuit.find in filtering mongo search
    queryFields.forEach(field => {
        if (req.query[field]){
            filters[field] = req.query[field]
        }
    });

   Circuit.find(filters)
       .limit(5)
       .sort({'circuitId': 1})
       .then(circuits => {
           res.json({circuits: circuits.map(circuit => {
               return circuit.serialize()
           })})
       })
       .catch(err => {
           console.log(err);
           res.status(400).json({message: 'Could not retrieve'})
       })
    });

//circuit creation endpoint
router.post('/circuit', jsonParser, (req,res) => {

    const requiredFields = [];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    //Nested look ups of 2 devices to make sure Z and A location devices existed before creating circuit
    Device.findOne({deviceName:req.body.aLocationDevice.deviceInfo.device})
        .then(aDevice => {
            console.log(aDevice);
            if (aDevice != null && Object.keys(aDevice).length > 0) {
                Device.findOne({deviceName:req.body.zLocationDevice.deviceInfo.device})
                    .then(zDevice => {
                        console.log(zDevice);
                        if (zDevice != null && Object.keys(zDevice).length > 0) {
                            Circuit.findOne({circuitID: req.body.circuitId})
                                .then(circuit => {
                                    console.log(circuit);
                                    Circuit.create({
                                        circuitId: req.body.circuitId,
                                        zLocationDevice: {
                                            deviceInfo: {
                                                device: zDevice._id,
                                                devicePort: req.body.zLocationDevice.deviceInfo.devicePort,
                                            }
                                        },
                                        aLocationDevice: {
                                            deviceInfo: {
                                                device: aDevice._id,
                                                devicePort: req.body.aLocationDevice.deviceInfo.devicePort,
                                            }
                                        },
                                        circuitAdditionalInformation: req.body.circuitAdditionalInformation
                                    })
                                        .then(res.status(200).json({message: 'Circuit has been created'}))
                                        .catch(err => {
                                            console.log(err);
                                            res.status(500).json({message: 'Could not create'})
                                        })
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({message: 'Could not create'})
                                })
                        }
                        else {
                            res.status(500).json({message:'zLocation Device does not exist'})
                        }
            })}
            else {
                res.status(500).json({message:'aLocation Device does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Error looking up circuit'})
        });
});

router.put('/circuit/:id', jsonParser, (req,res) => {

    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);

    return res.status(400).json({message: message});
  }
    const toUpdate = {};

    const updateableFields = ['circuitId','zLocationDevice','aLocationDevice','circuitAdditionalInformation'];

    updateableFields.forEach(field => {
        if (field in req.body) {
          toUpdate[field] = req.body[field];
        }
      });

    circuit
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(circuit => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));

});

//circuit delete function. Only returns 1 specific circuit to delete & no plans to add mass delete, this will be used when Id is not known
router.delete('/circuit', jsonParser, (req,res) => {

    Circuit.findOne({circuitId:req.body.circuitId})
        .then(circuit => {
            console.log(circuit);
             if(circuit != null && Object.keys(circuit).length > 0) {
                Circuit.deleteOne(circuit)
                    .then(res.status(400).json({message:'Success'}))
                    .catch(err => {
                            console.log(err);
                            res.status(500).json({message: 'Error deleting user'})
                        })
            }
            else {
                res.status(400).json({message: 'circuit does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Server Error'})
        })
});

//delete end point by using only ID
router.delete('/circuit/:id', jsonParser, (req,res) => {

    Circuit.findOne({_id:req.params.id})
        .then(circuit => {
            if(circuit != null && Object.keys(circuit).length > 0) {
                Circuit.deleteOne(circuit)
                    .then(res.status(400).json({message: 'Success'}))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({message: 'Error deleting circuit'})
                    })
            }
            else {
                res.status(400).json({message: 'circuit does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(200).json({message: 'Could not find circuit'})
        })
});

module.exports = { router };