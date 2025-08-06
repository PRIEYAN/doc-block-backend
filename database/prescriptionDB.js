const { randomUUID } = require('crypto');
const mongoose = require('mongoose');

function generatePrescriptionID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

const prescriptionSchema = new mongoose.Schema({
    prescrptionID: {
        type: String,
        required: true,
        unique: true,
        default: generatePrescriptionID
    },
    registrationNumber: { type: String, required: true },
    doctorWallet: { type: String, required: true },
    patientWallet: { type: String, required: true },
    doctor: {
        name: { type: String, required: true },
        PhoneNumber: { type: String, required: true },
        hospital: { type: String, required: true }
    },
    patient: {
        name: { type: String, required: true },
        PhoneNumber: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: Date, required: true }
    },
    medicines: { type: String, required: true },
    advice: { type: String, required: false },
    status: { type: String, require :true }, // pending, fullfilled
    QRImage : { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
},{collection: "prescriptionDetails"}); 

const Prescription = mongoose.model('prescriptionDetails', prescriptionSchema);

module.exports = Prescription;