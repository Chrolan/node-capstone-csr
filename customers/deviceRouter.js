'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Device } = require('./models');

const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const jsonParser = bodyParser.json();


//General device query, will allow passed parameters.
router.get('/', jsonParser, (req,res) => {

    const filters = {};
    const queryFields = ['deviceName','deviceManufacturer','deviceModel','deviceSerialNumber','deviceMac'];

    //appends fields to filters object, which is later used by Device.find in filtering mongo search
    queryFields.forEach(field => {
        if (req.query[field]){
            filters[field] = req.query[field]
        }
    });

   Device.find(filters)
       .limit(5)
       .sort({'deviceName': 1})
       .then(devices => {
           res.json({devices: devices.map(device => {
               return device.serialize()
           })})
   })
   .catch(err => {
       console.log(err);
       res.status(400).json({message: 'Could not retrieve'})
   })
});

//device creation endpoint
router.post('/', jsonParser, (req,res) => {

    const requiredFields = ['deviceName','deviceModel','deviceSerialNumber','deviceMac','deviceIpInformation'];

    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    //First finds device based on 3 attributes, if none found then creates. Cannot find based on ID because you won't know it at the time of creating new device
    Device.findOne({deviceName:req.body.deviceName,deviceSerialNumber:req.body.deviceSerialNumber})
        .then(device => {
            console.log(device);
            if(device != null && Object.keys(device).length > 0) {
                res.status(400).json({message: 'device already exists'})
            }
            else {
                Device.create({
                        deviceName: req.body.deviceName,
                        deviceManufacturer: req.body.deviceManufacturer,
					    deviceModel: req.body.deviceModel,
					    deviceSerialNumber: req.body.deviceSerialNumber,
					    deviceIpInformation: req.body.deviceIpInformation,
					    deviceMac: req.body.deviceMac,
				    })
                    .then(device => {
                        res.status(200).json(device.serialize());
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({message: 'Could not create'})
                    })
            }
        })
        .catch(err => {
            res.status(500).json({message: 'Error looking up device'})
        });
});

//will be able to update device by obj id
router.put('/device/:id', jsonParser, (req,res) => {

    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);

    return res.status(400).json({message: message});
  }
  //If you added more fields to the device model, will have to update updateableFields
    const toUpdate = {};
    const updateableFields = ['deviceName','deviceModel','deviceSerialNumber','deviceMac','deviceIpInformation'];

    updateableFields.forEach(field => {
        if (field in req.body) {
          toUpdate[field] = req.body[field];
        }
      });

    Device.findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(res.status(204).json({message: `Updated successfully`}))
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Internal server error'})
        });
});

//device delete function. Only returns 1 specific device to delete & no plans to add mass delete, this will be used when Id is not known
router.delete('/', jsonParser, (req,res) => {

    Device.findOne({deviceName:req.body.deviceName,deviceSerialNumber:req.body.deviceSerialNumber})
        .then(device => {
            console.log(device);
             if(device != null && Object.keys(device).length > 0) {
                Device.deleteOne(device)
                    .then(res.status(400).json({message:'Success'}))
                    .catch(err => {
                            console.log(err);
                            res.status(500).json({message: 'Error deleting user'})
                        })
            }
            else {
                res.status(400).json({message: 'Device does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Server Error'})
        })
});

//delete end point by using only ID
router.delete('/:id', jsonParser, (req,res) => {

    Device.findOne({_id:req.params.id})
        .then(device => {
            if(device != null && Object.keys(device).length > 0) {
                Device.deleteOne(device)
                    .then(res.status(400).json({message: 'Success'}))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({message: 'Error deleting user'})
                    })
            }
            else {
                res.status(400).json({message: 'Device does not exist'})
            }})
        .catch(err => {
            console.log(err);
            res.status(200).json({message: 'Could not find device'})
        })
});

module.exports = { router };