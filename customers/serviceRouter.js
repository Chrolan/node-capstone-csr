const express = require('express');
const bodyParser = require('body-parser');

const { Customer } = require('./models');
const { Service } = require('./models');
const { Device } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();

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