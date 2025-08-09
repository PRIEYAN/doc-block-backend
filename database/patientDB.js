const {randomUUID} = require('crypto');
const mongoose = require('mongoose');
const { PassThrough } = require('stream');

function genPatientId() {
    const chars = '0123456789';
    let id = 'ZR';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}


const patientSchema = new mongoose.Schema({
    patientID : {type : String, require,default : genPatientId},
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