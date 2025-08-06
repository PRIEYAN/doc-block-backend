const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const web3 = require('web3');
require('dotenv').config();

require('../../database/doctorDB.js');
require('../../database/prescriptionDB.js');

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
const Prescription = mongoose.model('prescriptionDetails');
const Patient = null;

router.get('/', (req, res) => {
    return res.status(200).json({message:"Core func (newPrescription) is running"});
});

router.post('/getPatientDetails', async (req, res) => {
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

router.post('/newPrescription', async (req, res) => {
    try{
        const {doctorWallet,patientWallet,doctorName,doctorPhoneNumber,doctorHospital,patientName,patientPhoneNumber, patientDOB,patientGender,medicinesName,medicinesQuantity,advice,registrationNumber} = req.body;
        if(!doctorWallet || !patientWallet || !doctorName || !doctorPhoneNumber || !doctorHospital || !patientName || !patientPhoneNumber || !patientDOB || !patientGender || !medicinesName || !medicinesQuantity || !registrationNumber){
            return res.status(400).json({message: "All fields are required"});
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
        });
        await newPrescription.save();


        return res.status(201).json({message: "Prescription created successfully", prescription: newPrescription});
    }catch(err){
        return res.status(500).json({message: "Internal server error",error:err.message});
    }
});

module.exports = router;
