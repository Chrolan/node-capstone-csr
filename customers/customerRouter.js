'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Customer } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();


//General customer query, will allow passed parameters.
router.get('/customer/', jsonParser, (req,res) => {

    const filters = {};
    const queryFields = ['customerType','customerName.lastName','customerAddress','customerBillingAccount','customerPhone','customerClient'];

    //appends fields to filters object, which is later used by customer.find in filtering mongo search
    queryFields.forEach(field => {
        if (req.query[field]){
            filters[field] = req.query[field]
        }
    });

   Customer.find(filters)
   .limit(5)
   .sort({'customerName': 1})
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

//customer creation endpoint
router.post('/customer', jsonParser, (req,res) => {

    const requiredFields = ['customerType','customerName','customerAddress','customerBillingAccount','customerPhone'];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    //First finds customer based on 3 attributes, if none found then creates. Cannot find based on ID because you won't know it at the time of creating new customer
    Customer.findOne({'customerName.lastName':req.body.customerName.lastName, customerClient:req.body.customerClient, customerBillingAccount: req.body.customerBillingAccount})
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
                    customerGateCode: req.body.customerGateCode
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


router.put('/customer/:id', jsonParser, (req,res) => {

    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);

    return res.status(400).json({message: message});
  }
    const toUpdate = {};

    const updateableFields = ['customerClient', 'customerType', 'customerName', 'customerAddress ', 'customerBillingAccount', 'customerPhone', 'customerSiteGps', 'customerEntryGps', 'customerAddressNote', 'customerGateCode']

    updateableFields.forEach(field => {
        if (field in req.body) {
          toUpdate[field] = req.body[field];
        }
      });

    Customer
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(customer => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));

});

//customer delete function. Only returns 1 specific customer to delete & no plans to add mass delete, this will be used when Id is not known
router.delete('/customer', jsonParser, (req,res) => {

    Customer.findOne({'customerName.lastName':req.body.customerName.lastName, customerClient:req.body.customerClient, customerBillingAccount: req.body.customerBillingAccount})
        .then(customer => {
            console.log(customer);
             if(customer != null && Object.keys(customer).length > 0) {
                Customer.deleteOne(customer)
                    .then(res.status(400).json({message:'Success'}))
                    .catch(err => {
                            console.log(err);
                            res.status(500).json({message: 'Error deleting user'})
                        })
            }
            else {
                res.status(400).json({message: 'Customer does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Server Error'})
        })
});

router.delete('/customer/:id', jsonParser, (req,res) => {

    Customer.findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = { router };