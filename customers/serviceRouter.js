'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Service } = require('./models');
const { Circuit } = require('./models');
const { Customer } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

//General Service query, will allow passed parameters.
router.get('/Service/', jsonParser, (req,res) => {

    const filters = {};
    const queryFields = ['serviceClient', 'serviceType', 'mediaType', 'bandwidth', 'circuitId', 'departmentId', 'dataVlan', 'voiceVlan', 'dataCenter', 'distributionArea', 'daDeviceName', 'fiberToDataCenter', 'splitterPigtail', 'fiberToOnt', 'customer', 'circuit' ];

    //appends fields to filters object, which is later used by Service.find in filtering mongo search
    queryFields.forEach(field => {
        if (req.query[field]){
            filters[field] = req.query[field]
        }
    });

   Service.find(filters)
       .limit(5)
       .sort({'ServiceId': 1})
       .then(Services => {
           res.json({Services: Services.map(Service => {
               return Service.serialize()
           })})
       })
       .catch(err => {
           console.log(err);
           res.status(400).json({message: 'Could not retrieve'})
       })
    });

//Service creation endpoint
router.post('/Service', jsonParser, (req,res) => {

    const requiredFields = ['serviceClient', 'serviceType', 'mediaType', 'bandwidth', 'circuitId', 'departmentId', 'dataVlan', 'voiceVlan', 'dataCenter', 'distributionArea', 'daDeviceName', 'fiberToDataCenter', 'splitterPigtail', 'fiberToOnt', 'customer', 'circuit' ];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    //Nested look ups of 2 devices to make sure Z and A location devices existed before creating Service
    Customer.findOne({'customerName.lastName':req.body.customerName.lastName, customerClient:req.body.customerClient, customerBillingAccount: req.body.customerBillingAccount})
        .then(customer => {
            console.log(customer);
            if (customer != null && Object.keys(customer).length > 0) {
                Circuit.findOne({circuitId:req.body.circuitId})
                    .then(circuit => {
                        console.log(circuit);
                        if (circuit != null && Object.keys(circuit).length > 0) {
                            Service.findOne({ServiceID: req.body.ServiceId})
                                .then(Service => {
                                    console.log(Service);
                                    Service.create()
                                        .then(res.status(200).json({message: 'Service has been created'}))
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
            res.status(500).json({message: 'Error looking up Service'})
        });
});

router.put('/Service/:id', jsonParser, (req,res) => {

    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);

    return res.status(400).json({message: message});
  }
    const toUpdate = {};

    const updateableFields = ['ServiceId','zLocationDevice','aLocationDevice','ServiceAdditionalInformation'];

    updateableFields.forEach(field => {
        if (field in req.body) {
          toUpdate[field] = req.body[field];
        }
      });

    Service
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(Service => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));

});

//Service delete function. Only returns 1 specific Service to delete & no plans to add mass delete, this will be used when Id is not known
router.delete('/Service', jsonParser, (req,res) => {

    Service.findOne({ServiceId:req.body.ServiceId})
        .then(Service => {
            console.log(Service);
             if(Service != null && Object.keys(Service).length > 0) {
                Service.deleteOne(Service)
                    .then(res.status(400).json({message:'Success'}))
                    .catch(err => {
                            console.log(err);
                            res.status(500).json({message: 'Error deleting user'})
                        })
            }
            else {
                res.status(400).json({message: 'Service does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Server Error'})
        })
});

//delete end point by using only ID
router.delete('/Service/:id', jsonParser, (req,res) => {

    Service.findOne({_id:req.params.id})
        .then(Service => {
            if(Service != null && Object.keys(Service).length > 0) {
                Service.deleteOne(Service)
                    .then(res.status(400).json({message: 'Success'}))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({message: 'Error deleting Service'})
                    })
            }
            else {
                res.status(400).json({message: 'Service does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(200).json({message: 'Could not find Service'})
        })
});

module.exports = { router };