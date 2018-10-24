'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password : {type: String, required: true},
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    email : {type: String, required: true},
    phone: {type: String, required: true},
    companyName: {type: String, required: true},
    typeOfUser: {type: Number, required: true}
});

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.serialize = function () {
    return {
        name: `${this.firstName} ${this.lastName}`
    }
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };