const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const web3 = require('web3');
require('dotenv').config();

require('../../database/doctorDB.js');
require('../../database/prescriptionDB.js');
require('../../database/patientDB.js');

const router = express.Router();
router.use(cors());
router.use(express.json());

const mongoURL = process.env.MONGOURL;
const JWT_SECRET = process.env.JWT_SECRET;  

mongoose.connect(mongoURL)
    .then(() => {
        console.log("Connected to MongoDB (newprescription)");
    }  )
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

const Doctor = mongoose.model('doctorInfo');
const Prescription = mongoose.model('prescriptionDetails');
const Patient = mongoose.model('patientInfo');

router.get('/', (req, res) => {
    return res.status(200).json({message:"Core func (newPrescription) is running"});
});

router.post('/getPatientDetails', async (req, res) => {
  try {
    const { PhoneNumber } = req.body;

    if (!PhoneNumber) {
      return res.status(400).json({ message: "PhoneNumber is required" });
    }

    const existingPatient = await Patient.findOne({ PhoneNumber });

    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found, register first" });
    }

    return res.status(200).json({
      message: "Patient details fetched successfully",
      patient: existingPatient
    });

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
});

router.post('/newPrescription', async (req, res) => {
    try{
        const {
    prescrptionID,
    doctorWallet,
    patientWallet,
    doctorName,
    doctorPhoneNumber,
    doctorHospital,
    patientName,
    patientPhoneNumber,
    patientDOB,
    patientGender,
    medicines,
    advice,
    registrationNumber,
    QRImage
} = req.body;

if (
    !prescrptionID ||
    !doctorWallet ||
    !patientWallet ||
    !doctorName ||
    !doctorPhoneNumber ||
    !doctorHospital ||
    !patientName ||
    !patientPhoneNumber ||
    !patientDOB ||
    !patientGender ||
    !medicines ||
    Object.keys(medicines).length === 0 ||
    !registrationNumber ||
    !QRImage
) {
    return res.status(400).json({ message: "All fields are required" });
}

for (const [medName, medDetails] of Object.entries(medicines)) {
    if (
        typeof medDetails.m === "undefined" ||
        typeof medDetails.E === "undefined" ||
        typeof medDetails.n === "undefined" ||
        typeof medDetails.time === "undefined"
    ) {
        return res.status(400).json({ message: `Medicine '${medName}' is missing required schedule fields` });
    }
}


        // Format medicines as string in "medicine: quantity" format
        const medicinesString = Object.keys(medicinesName).map(key => 
            `${medicinesName[key]}: ${medicinesQuantity[key]}`
        ).join(', ');

        //web3..

        //storing in db
        const newPrescription = new Prescription({
            doctorWallet,
            patientWallet,
            registrationNumber,
            doctor: {
                name: doctorName,
                PhoneNumber: doctorPhoneNumber,
                hospital: doctorHospital
            },
            patient: {
                name: patientName,
                PhoneNumber: patientPhoneNumber,
                dob: new Date(patientDOB),
                gender: patientGender
            },
            medicines: medicinesString,
            advice: advice || '',
            ORImage,
            status: 'pending',
        });
        await newPrescription.save();


        return res.status(201).json({message: "Prescription created successfully", prescription: newPrescription});
    }catch(err){
        return res.status(500).json({message: "Internal server error",error:err.message});
    }
});

module.exports = router;
