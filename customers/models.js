'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//service request model, this will reference all other models in some way
//due to it being used as the record holder for addition of items into telco database by end user
const serviceRequestSchema = mongoose.Schema ({
    customerReferenceNumber: { type: String, required: true},
    customerCompanyName: { type: String, required: true},
    authorizedSubmitter: {type: mongoose.Schema.ObjectId, ref:'User'},
    serviceRequestNumber: {type:Number, required: true},
    formSubmitDate: {type: String, required: true},
    requestedProvDate:{type: String, required: true},
    targetInstallDate: {type: String, required: true},
    serviceRequestType: { type: String, required: true},
    serviceRequestPriority: { type: String, required: true},
    serviceRequestDetails: { type: String, required: true},
    serviceAffecting: {
        yesOrNo :{ type: Boolean, required:true},
        details: {type: String}},
    serviceProtected: {
        yesOrNo :{ type: Boolean, required:true},
        details: {type: String}},
    service: {type: mongoose.Schema.ObjectId, ref: 'Service'}
});

//service schema will hold information of each service provided by Telco
//service rides a circuit for a customer
const serviceSchema = mongoose.Schema ({
    serviceClient: {type: String, required: true},
    serviceType: {type: String, required: true},
    mediaType: {type: String, required: true},
    bandwidth: {type: String, required: true},
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

//end devices available on network for inventory
const deviceSchema = mongoose.Schema({
    deviceName: {type: String, required: true},
    deviceManufacturer: {type: String, required: true},
    deviceModel: {type: String, required: true},
    deviceSerialNumber: {type: String, required: true},
    deviceIpInformation: {type: String, required: true},
    deviceMac: {type: String, required: true},
});

//circuit has 2 ends, a device at each
const circuitSchema = mongoose.Schema({
   circuitId: {type: String, required: true},
   zLocationDevice : {
        deviceInfo:{
            device: {type: mongoose.Schema.ObjectId, ref: 'Device', required: true },
            devicePort: {type: String, required: true},
   }},
    aLocationDevice : {
        deviceInfo:{
            device: {type: mongoose.Schema.ObjectId, ref: 'Device'},
            devicePort: {type: String, required: true},
   }},
    circuitAdditionalInformation: {type: String}
});

//telco customer for inventorying
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
const Request = mongoose.model('Request', serviceRequestSchema);

module.exports = { Customer , Device, Service, Circuit, Request};