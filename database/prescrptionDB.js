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
    medicines: {
        type: Map,
        of: Number,
        required: true
    },
    advice: { type: String, required: false },
    status: { type: String, default: 'pending' }, // pending, approved, rejected
    CreatedDate: { type: Date, default: Date.now },
    UpdatedTime : {type:String,required:false}
});

module.exports = mongoose.model('prescriptionDetails', prescriptionSchema);