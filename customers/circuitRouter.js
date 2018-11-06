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
router.get('/', jsonParser, (req,res) => {

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
       .populate({ "path" : "zLocationDevice.deviceInfo.device" })
       .populate({ "path" : "aLocationDevice.deviceInfo.device" })
       .sort({'circuitId': 1})
       .then(circuits => {
           res.json({circuits: circuits.map(circuit => {
               return circuit
           })})
       })
       .catch(err => {
           console.log(err);
           res.status(400).json({message: 'Could not retrieve'})
       })
    });

//circuit creation endpoint
router.post('/', jsonParser, (req,res) => {

    const requiredFields = ['circuitId','zLocationDevice','aLocationDevice'];

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
                            Circuit.findOne({circuitId: req.body.circuitId})
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
                                        circuitAdditionalInformation: req.body.circuitAdditionalInformation,
                                        authorizedSubmitter: req.user.id
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

router.put('/:id', jsonParser, (req,res) => {

    const requiredFields = ['circuitId','zLocationDevice','aLocationDevice'];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    //Reused the post systematic approach of finding devices before trying to update.
    //This is because the remote user won't have the ID to update the field, and we need to do a look up for that to replace
    Device.findOne({deviceName:req.body.aLocationDevice.deviceInfo.device})
        .then(aDevice => {
            if (aDevice != null && Object.keys(aDevice).length > 0) {
                Device.findOne({deviceName:req.body.zLocationDevice.deviceInfo.device})
                    .then(zDevice => {
                        if (zDevice != null && Object.keys(zDevice).length > 0) {
                            Circuit.findOne({_id:req.params.id})
                                .then(circuit => {
                                    Circuit.update({
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
                                        .then(res.status(200).json({message: 'Circuit has been updated'}))
                                        .catch(err => {
                                            console.log(err);
                                            res.status(500).json({message: 'Could not update'})
                                        })
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({message: 'Could not update'})
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

//circuit delete function. Only returns 1 specific circuit to delete & no plans to add mass delete, this will be used when Id is not known
router.delete('/', jsonParser, (req,res) => {

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
router.delete('/:id', jsonParser, (req,res) => {

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