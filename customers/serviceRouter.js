'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Service } = require('./models');
const { service } = require('./models');
const { Customer } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();


//General service query, will allow passed parameters.
router.get('/service/', jsonParser, (req,res) => {

    const filters = {};
    const queryFields = [];

    //appends fields to filters object, which is later used by Service.find in filtering mongo search
    queryFields.forEach(field => {
        if (req.query[field]){
            filters[field] = req.query[field]
        }
    });

   Service.find(filters)
       .limit(5)
       .populate({ "path" : "customer" })
       .populate({ "path" : "circuit" })
       .sort({'serviceId': 1})
       .then(services => {
           res.json({services: services.map(service => {
               return service
           })})
       })
       .catch(err => {
           console.log(err);
           res.status(400).json({message: 'Could not retrieve'})
       })
    });

//service creation endpoint
router.post('/service', jsonParser, (req,res) => {

    const requiredFields = ['zLocationDevice.deviceInfo.device','zLocationDevice.deviceInfo.device','aLocationDevice.deviceInfo.devicePort','aLocationDevice.deviceInfo.devicePort'];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    //Nested look ups of 2 devices to make sure Z and A location devices existed before creating service
    Device.findOne({deviceName:req.body.aLocationDevice.deviceInfo.device})
        .then(aDevice => {
            console.log(aDevice);
            if (aDevice != null && Object.keys(aDevice).length > 0) {
                Device.findOne({deviceName:req.body.zLocationDevice.deviceInfo.device})
                    .then(zDevice => {
                        console.log(zDevice);
                        if (zDevice != null && Object.keys(zDevice).length > 0) {
                            Service.findOne({serviceId: req.body.serviceId})
                                .then(service => {
                                    console.log(service);
                                    Service.create({
                                        serviceId: req.body.serviceId,
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
                                        serviceAdditionalInformation: req.body.serviceAdditionalInformation
                                    })
                                        .then(res.status(200).json({message: 'service has been created'}))
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
            res.status(500).json({message: 'Error looking up service'})
        });
});

router.put('/service/:id', jsonParser, (req,res) => {

    const requiredFields = [];

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
            console.log(aDevice);
            if (aDevice != null && Object.keys(aDevice).length > 0) {
                Device.findOne({deviceName:req.body.zLocationDevice.deviceInfo.device})
                    .then(zDevice => {
                        console.log(zDevice);
                        if (zDevice != null && Object.keys(zDevice).length > 0) {
                            Service.findOne({serviceId: req.body.serviceId})
                                .then(service => {
                                    console.log(service);
                                    Service.update({
                                        serviceId: req.body.serviceId,
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
                                        serviceAdditionalInformation: req.body.serviceAdditionalInformation
                                    })
                                        .then(res.status(200).json({message: 'service has been updated'}))
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
            res.status(500).json({message: 'Error looking up service'})
        });
});

//service delete function. Only returns 1 specific service to delete & no plans to add mass delete, this will be used when Id is not known
router.delete('/service', jsonParser, (req,res) => {

    Service.findOne({serviceId:req.body.serviceId})
        .then(service => {
            console.log(service);
             if(service != null && Object.keys(service).length > 0) {
                Service.deleteOne(service)
                    .then(res.status(400).json({message:'Success'}))
                    .catch(err => {
                            console.log(err);
                            res.status(500).json({message: 'Error deleting user'})
                        })
            }
            else {
                res.status(400).json({message: 'service does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Server Error'})
        })
});

//delete end point by using only ID
router.delete('/service/:id', jsonParser, (req,res) => {

    Service.findOne({_id:req.params.id})
        .then(service => {
            if(service != null && Object.keys(service).length > 0) {
                Service.deleteOne(service)
                    .then(res.status(400).json({message: 'Success'}))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({message: 'Error deleting service'})
                    })
            }
            else {
                res.status(400).json({message: 'service does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(200).json({message: 'Could not find service'})
        })
});

module.exports = { router };