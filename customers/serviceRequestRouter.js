'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Service } = require('./models');
const { Request } = require('./models');
const { User } = require('../users/models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();


//General service query, will allow passed parameters.
router.get('/', jsonParser, (req,res) => {

    const filters = {};
    const queryFields = [];

    //appends fields to filters object, which is later used by Request.find in filtering mongo search
    queryFields.forEach(field => {
        if (req.query[field]){
            filters[field] = req.query[field]
        }
    });

   Request.find(filters)
       .limit(5)
       .populate({ "path" : "service" })
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

    Service.findOne({})
        .then(service => {
            if (service != null && Object.keys(service).length > 0) {
                Request.findOne({circuitId:req.body.circuitId})
                    .then(request => {
                        if (request === null && Object.keys(request).length === 0) {
                            Request.create({
                                customerReferenceNumber: req.body.customerReferenceNumber,
                                customerCompanyName: req.body.customerCompanyName,
                                authorizedSubmitter: req.user.name,
                                serviceRequestNumber: req.body.serviceRequestNumber,
                                formSubmitDate: req.body.formSubmitDate,
                                requestedProvDate:req.body.requestedProvDate,
                                targetInstallDate: req.body.targetInstallDate,
                                serviceRequestType: req.body.serviceRequestType,
                                serviceRequestPriority: req.body.serviceRequestPriority,
                                serviceRequestDetails: req.body.serviceRequestDetails,
                                serviceAffecting: {
                                    yesOrNo :req.body.serviceAffecting.yesOrNo,
                                    details: req.body.serviceAffecting.details },
                                serviceProtected: {
                                    yesOrNo :req.body.serviceProtected.yesOrNo,
                                    details: req.body.serviceProtected.details },
                                service: service._id
                            })
                                .then(res.status(200).json({message: 'Request has been created'}))
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({message: 'Could not create'})
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
                                    Request.findOne({_id:req.params.id})
                                        .then(service => {
                                            Request.update({
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
                                                circuit: circuit._id
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

    Request.findOne({serviceId:req.body.serviceId})
        .then(service => {
            console.log(service);
             if(service != null && Object.keys(service).length > 0) {
                Request.deleteOne(service)
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

    Request.findOne({_id:req.params.id})
        .then(service => {
            if(service != null && Object.keys(service).length > 0) {
                Request.deleteOne(service)
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