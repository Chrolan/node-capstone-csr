'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Customer } = require('./models');
const { Service } = require('./models');
const { Device } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();


//General customer query, no parameters passed. Will retrieve all customers
router.get('/customer', jsonParser, (req,res) => {

   Customer.find()
       .limit(5)
       .then(customers => {
           res.json({customers: customers.map(customer => {
               return customer.serialize()
           })})
       })
       .catch(err => {
           console.log(err);
           res.status(400).json({message: 'Could not retrieve'})
       })
});

//customer creation 
router.post('/customer', jsonParser, (req,res) => {

    const requiredFields = ['customerType','customerName','customerAddress','customerBillingAccount','customerPhone'];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    console.log(req.body);

    Customer.find({customerName:req.body.customerName, customerClient:req.body.customerClient, customerBillingAccount: req.body.customerBillingAccount})
        .then(customer => {
            console.log(customer);
            if(customer != null && Object.keys(customer).length > 0) {
                res.status(400).json({message: 'Customer already exists'})
            }
            else {
                Customer.create({
                    customerClient: req.body.customerClient,
                    customerType: req.body.customerType,
                    customerName: req.body.customerName,
                    customerAddress : {
                        customerStreet1: req.body.customerAddress.customerStreet1,
                        customerStreet2: req.body.customerAddress.customerStreet2,
                        customerCity: req.body.customerAddress.customerCity,
                        customerState: req.body.customerAddress.customerZip,
                        customerZip: req.body.customerAddress.customerZip
                    },
                    customerBillingAccount: req.body.customerBillingAccount,
                    customerPhone: req.body.customerPhone,
                    customerSiteGps: req.body.customerSiteGps,
                    customerEntryGps: req.body.customerEntryGps,
                    customerAddressNote: req.body.customerAddressNote,
                    customerGateCode: req.body.customerGateCode,
                })
                    .then(customer => {
                        res.status(200).json({
                            customerName: customer.customerName,
                            customerType: customer.customerType,
                            customerBillingAccount: customer.customerBillingAccount
                        });
                    })
                    .catch(err => {
                        res.status(500).json({message: 'Could not create'})
                    })
            }
        })
        .catch(err => {
            res.status(500).json({message: 'Error looking up customer'})
        });
});


/*
router.post('/service', jsonParser, (req,res) => {

    const requiredFields = ["serviceClient","serviceType", "mediaType", "bandwidth", "circuitId", "departmentId", "dataVlan ", "voiceVlan", "dataCenter", "distributionArea", "daDeviceName", "fiberToDataCenter", "splitterPigtail", "fiberToOnt"];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    Service.findOne({serviceClient: req.body.serviceClient, serviceType: req.body.serviceType, customer: req.body.customer_id})



});
*/


module.exports = { router };