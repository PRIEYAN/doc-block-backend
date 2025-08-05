const { randomUUID } = require('crypto');
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    nmrNumber: { type: String, required: true },
    yearRegistered: { type: String, required: true },
    adharNumber: { type: String, required: true },
    password: { type: String, required: true , select : false },
    hospital: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    _id: { type: String, default: randomUUID }
}, { collection: "doctorInfo" });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;