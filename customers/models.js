'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const serviceSchema = mongoose.Schema ({
    serviceClient: {type: String, required: true},
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
    customer: {type: mongoose.Schema.ObjectId, ref: 'Customer'},
    circuit: {type: mongoose.Schema.ObjectId, ref: 'Circuit'}
});

const deviceSchema = mongoose.Schema({
    deviceName: {type: String, required: true},
    deviceManufacturer: {type: String, required: true},
    deviceModel: {type: String, required: true},
    deviceSerialNumber: {type: String, required: true},
    deviceIpInformation: {type: String, required: true},
    deviceMac: {type: String, required: true},
});

const circuitSchema = mongoose.Schema({
   circuitId: {type: String, required: true},
   zLocationDevice : {
        deviceInfo:{
            device:{type: mongoose.Schema.ObjectId, ref: 'Device'},
            devicePort: {type: String, required: true},
   }},
    aLocationDevice : {
        deviceInfo:{
            device:{type: mongoose.Schema.ObjectId, ref: 'Device'},
            devicePort: {type: String, required: true},
   }},
    deviceAdditionalInformation: {type: String}
});

const customerSchema = mongoose.Schema ({
    customerClient: {type: String, required: true},
    customerType: {type: String, required: true},
    customerName: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    customerAddress : {
        customerStreet1: {type: String, required: true},
        customerStreet2: {type: String},
        customerCity: {type: String, required: true},
        customerState: {type: String, required: true},
        customerZip: {type: String, required: true}
    },
    customerBillingAccount: {type: String, required: true},
    customerPhone: {type: String, required: true},
    customerSiteGps: {type: Number},
    customerEntryGps: {type: Number},
    customerAddressNote: { type: String},
    customerGateCode: {type:String},
});

customerSchema.virtual('nameOfCustomer').get(function () {
    return `${this.customerName.firstName} ${this.customerName.lastName}`.trim();
});

customerSchema.methods.serialize = function () {
    return {
        id: this._id,
        customerName : this.nameOfCustomer,
        customerBillingAccount: this.customerBillingAccount,
    }
};

deviceSchema.methods.serialize = function () {
    return {
        id: this._id,
        deviceName: this.deviceName,
        deviceSerialNumber: this.deviceSerialNumber
    }
};

const Service = mongoose.model('Service', serviceSchema);
const Device = mongoose.model('Device', deviceSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Circuit = mongoose.model('Circuit', circuitSchema);

module.exports = { Customer , Device, Service};