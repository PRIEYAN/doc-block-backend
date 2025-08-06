const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const web3 = require('web3');
require('dotenv').config();

require('../../database/doctorDB.js');
require('../../database/prescrptionDB.js');

const router = express.Router();
router.use(cors());
router.use(express.json());

const mongoURL = process.env.MONGOURL;
const JWT_SECRET = process.env.JWT_SECRET;  

mongoose.connect(mongoURL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    }); 

const Doctor = mongoose.model('doctorInfo');
const Prescription = mongoose.model('prescrptionDetails');
const Patient = null;

router.use('/', (req, res) => {
    return res.status(200).json({message:"Doctor Auth Service is running"});
});

router.post('doctor/core/getPatientDetails', async (req, res) => {
    try{
        const { PhoneNumber } = req.body;
        if(!PhoneNumber){
            return res.status(400).json({message: "PhoneNumber is required"});
        }
        const existingPatient = await Patient.findOne({PhoneNumber:PhoneNumber});
        if(!existingPatient){
            return res.status(404).json({message: "Patient not found"});
        }
        return res.status(200).json({message: "Patient details fetched successfully", patient: existingPatient});

    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
});

router.post('/doctor/core/newPrescription', async (req, res) => {
    try{
        const {doctorWallet,patientWallet,doctorName,doctorPhoneNumber,doctorHospital,patientName,patientPhoneNumber, patientDOB,patientGender,medicinesName,medicinesQuantity,advice} = req.body;
        if(!doctorWallet || !patientWallet || !doctorName || !doctorPhoneNumber || !doctorHospital || !patientName || !patientPhoneNumber || !patientDOB || !patientGender || !medicinesName || !medicinesQuantity){
            return res.status(400).json({message: "All fields are required"});
        }

        //web3..

        //storing in db
        const newPrescription = new Prescription({
            doctorWallet,
            patientWallet,
            doctor: {
                name: doctorName,
                PhoneNumber: doctorPhoneNumber,
                hospital: doctorHospital
            },
            patient: {
                name: patientName,
                PhoneNumber: patientPhoneNumber,
                dob: new Date(patientDOB),
            },
            medicines: new Map(Object.entries(medicinesName).map((key, index) => [key, medicinesQuantity[index]])),
            advice: advice || '',
        });
        await newPrescription.save();


        return res.status(201).json({message: "Prescription created successfully", prescription: newPrescription});
    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
});

module.exports = router;
