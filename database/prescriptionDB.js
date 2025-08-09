const { randomUUID } = require('crypto');
const mongoose = require('mongoose');


const prescriptionSchema = new mongoose.Schema({
    prescrptionID: {
        type: String,
        required: true,
        unique: true,
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
    medicines: {
        type: Map,
        of: new mongoose.Schema({
            m: { type: Number, enum: [0, 1], required: true },  // morning
            E: { type: Number, enum: [0, 1], required: true },  // evening
            n: { type: Number, enum: [0, 1], required: true },  // night
            time: { type: Number, enum: [0, 1], required: true } // before/after food
        }),
        required: true
    },
    advice: { type: String },
    status: { type: String, required: true }, // pending, fulfilled
    QRImage: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
}, { collection: "prescriptionDetails" });

const Prescription = mongoose.model('prescriptionDetails', prescriptionSchema);
module.exports = Prescription;
