const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const web3 = require('web3');
require('dotenv').config();

require('./database/doctorDB');


const app = express();
app.use(cors());
app.use(express.json());

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
const Patient =null;

const Doctor = require('./database/doctorDB');

app.use('/',(req,res)=>{
return res.status(200).json({message:"Doctor Auth Service is running"});
});

app.post('doctor/core/getPatientDetails',async (req, res) => {
    try{
        const{PhoneNumber}=req.body;
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

app.post('/doctor/core/newPrescription',async (req, res) => {
    try{
        const{doctorWallet,patientWallet,doctorName,doctorPhoneNumber,doctorHospital,patientName,patientPhoneNumber, patientDOB,patientGender,medicinesName,medicinesQuantity,advice} = req.body;
        if(!doctorWallet || !patientWallet || !doctorName || !doctorPhoneNumber || !doctorHospital || !patientName || !patientPhoneNumber || !patientDOB || !patientGender || !medicinesName || !medicinesQuantity){
            return res.status(400).json({message: "All fields are required"});
        }

    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
});