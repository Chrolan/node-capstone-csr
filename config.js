'use strict';
exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://chrolan:Hello1234@ds143143.mlab.com:43143/csr';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'Fujitsu#2020';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';