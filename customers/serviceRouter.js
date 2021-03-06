'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Service } = require('./models');
const { Circuit } = require('./models');
const { Customer } = require('./models');
const { Device } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();


//General service query, will allow passed parameters.
router.get('/', jsonParser, (req,res) => {

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
       .populate({ "path" : "circuit", "model": "Circuit", populate: [{
           path: "zLocationDevice.deviceInfo.device", model: "Device"},{path: "aLocationDevice.deviceInfo.device",model:"Device"}]})
       .sort({'customer': 1})
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
router.post('/', jsonParser, (req,res) => {

    const requiredFields = [];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    Customer.findOne({customerBillingAccount: req.body.customerBillingAccount})
        .then(customer => {
            if (customer != null && Object.keys(customer).length > 0) {
                Circuit.findOne({circuitId:req.body.circuitId})
                    .then(circuit => {
                        if (circuit != null && Object.keys(circuit).length > 0) {
                            Service.find({circuit: circuit._id})
                                .then(service => {
                                    if (service) {
                                        res.status(400).json({message: 'Service already exists'})
                                    }
                                    else {
                                        Service.create({
                                            serviceType: req.body.serviceType,
                                            mediaType: req.body.mediaType,
                                            bandwidth: req.body.bandwidth,
                                            circuitId: req.body.circuitId,
                                            departmentId: req.body.departmentId,
                                            dataVlan: req.body.dataVlan,
                                            voiceVlan: req.body.voiceVlan,
                                            dataCenter: req.body.dataCenter,
                                            distributionArea: req.body.distributionArea,
                                            daDeviceName: req.body.daDeviceName,
                                            fiberToDataCenter: req.body.fiberToDataCenter,
                                            splitterPigtail: req.body.splitterPigtail,
                                            fiberToOnt: req.body.fiberToOnt,
                                            customer: customer._id,
                                            circuit: circuit._id
                                        })
                                            .then(res.status(200).json({message: 'Service has been created'}))
                                            .catch(err => {
                                                console.log(err);
                                                res.status(500).json({message: 'Could not create'})
                                            })
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({message: 'Could not create'})
                                })
                        }
                        else {
                            res.status(501).json({message: 'Circuit does not exist'})
                        }
                    })}
            else {
                res.status(502).json({message:'Customer does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(503).json({message: 'Error looking up Service'})
        });
});

router.put('/:id', jsonParser, (req,res) => {

    const requiredFields = [];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    Customer.findOne({'customerName.lastName':req.body.customerName.lastName, customerClient:req.body.customerClient, customerBillingAccount: req.body.customerBillingAccount})
        .then(customer => {
            if (customer != null && Object.keys(customer).length > 0) {
                Circuit.findOne({circuitId:req.body.circuitId})
                    .then(circuit => {
                        if (circuit != null && Object.keys(circuit).length > 0) {
                            Circuit.findOne({circuitId: req.body.circuitId})
                                .then(circuit => {
                                    Service.findOne({_id:req.params.id})
                                        .then(service => {
                                            Service.update({
                                                serviceClient: req.body.serviceClient,
                                                serviceType: req.body.serviceType,
                                                mediaType: req.body.mediaType,
                                                bandwidth: req.body.bandwidth,
                                                circuitId: req.body.circuitId,
                                                departmentId: req.body.departmentId,
                                                dataVlan: req.body.dataVlan,
                                                voiceVlan: req.body.voiceVlan,
                                                dataCenter: req.body.dataCenter,
                                                distributionArea: req.body.distributionArea,
                                                daDeviceName: req.body.daDeviceName,
                                                fiberToDataCenter: req.body.fiberToDataCenter,
                                                splitterPigtail: req.body.splitterPigtail,
                                                fiberToOnt: req.body.fiberToOnt,
                                                customer: customer._id,
                                                circuit: circuit._id,
                                                authorizedSubmitter: req.user.id
                                            })
                                                .then(res.status(200).json({message: 'Service has been updated'}))
                                                .catch(err => {
                                                    console.log(err);
                                                    res.status(500).json({message: 'Could not create'})
                                                })
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        res.status(500).json({message:'Could not find service'})})
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({message: 'Could not update service'})
                                })
                        }
                        else {
                            res.status(500).json({message:'Circuit Device does not exist'})
                        }
            })}
            else {
                res.status(500).json({message:'Customer does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Error looking up Service'})
        });
});

//service delete function. Only returns 1 specific service to delete & no plans to add mass delete, this will be used when Id is not known
router.delete('/', jsonParser, (req,res) => {

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
router.delete('/:id', jsonParser, (req,res) => {

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