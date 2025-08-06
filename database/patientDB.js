const {randomUUID} = require('crypto');
const mongoose = require('mongoose');
const { PassThrough } = require('stream');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    PhoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    adharNumber: { type: String, required: true },
    dob: { type: Date, required: true },
    otherDetails: { type: String, required: false }, // like allergic to something
},{collection: "patientInfo"});

const Patient = mongoose.model('patientInfo', patientSchema);

module.exports = Patient;