'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const serviceSchema = mongoose.Schema ({
   serviceType: {type: String, required: true},
    mediaType: {type: String, required: true},
    bandwidth: {type: String, required: true},
    circuitId: {type: String, required: true},
    departmentId: {type: String, required: true},
    dataVlan : {type: String, required: true},
    voiceVlan: {type: String, required: true},
    dataCenter: {type: String, required: true},
    distributionArea : {type: String, required: true},
    daDeviceName: {type: String, required: true},
    fiberToDataCenter: {type: String, required: true},
    splitterPigtail: {type: String, required: true},
    fiberToOnt: {type: String, required: true},
});


const deviceSchema = mongoose.Schema ({
   zLocation : {
       deviceName: {type: String, required: true},
       deviceManufacturer: {type: String, required: true},
       deviceModel: {type: String, required: true},
       devicePort: {type: String, required: true},
       deviceSerialNumber: {type: String, required: true},
       deviceIpInformation: {type: String, required: true},
       deviceMac: {type: String, required: true},
       deviceAdditionalInformation: {type: String}
   },
    aLocation : {
       deviceName: {type: String, required: true},
       deviceManufacturer: {type: String, required: true},
       deviceModel: {type: String, required: true},
       devicePort: {type: String, required: true},
       deviceSerialNumber: {type: String, required: true},
       deviceIpInformation: {type: String, required: true},
       deviceMac: {type: String, required: true},
       deviceAdditionalInformation: {type: String}
   }
});

const customerSchema = mongoose.Schema ({
    customerType: {type: String, required: true},
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

const Service = mongoose.model('Service', serviceSchema);
const Device = mongoose.model('Device', deviceSchema);
const Customer = mongoose.model('Customer', customerSchema);

module.export = { Customer , Device, Service};