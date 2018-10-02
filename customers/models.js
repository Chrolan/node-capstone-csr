'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const addressSchema = mongoose.Schema({

});

const customerSchema = mongoose.Schema ({
    type: {type: String, required: true},
    customerName: {type: String, required: true},
    customerAddress : {
        customerStreet1: {type: String, required: true},
        customerStreet2: {type: String, required: true},
        customerCity: {type: String, required: true},
        customerState: {type: String, required: true},
        customerZipe: {type: String, required: true}
    },
    customerBillingAccount: {type: String, required: true},
    customerPhone: {type: String, required: true},
    customerSiteGps: {type: Number},
    customerEntryGps: {type: Number},
    customerAddressNote: { type: String},
    customerGateCode: {type:String}
    
});



const Customer = mongoose.model('Customer', customerSchema);

module.export = { Customer };