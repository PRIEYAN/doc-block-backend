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

router.use('/', (req, res) => {
    return res.status(200).json({message:"Prescription Request Service is running"});
});

router.post('/prescriptionRequest', async (req, res) => {
    try{
        const{token, prescriptionID} = req.body;
        if(!token || !prescriptionID){
            return res.status(400).json({message: "Token and prescriptionID are required"});
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded || !decoded.PhoneNumber){
            return res.status(400).json({message: "Invalid token"});
        }
        const prescription = await Prescription.findOne({prescriptionID: prescriptionID, "doctor.PhoneNumber": decoded.PhoneNumber});
        if(!prescription){
            return res.status(404).json({message: "Prescription not found"});
        }
        const approvPrescription = await Prescription.updateOne(
            { prescriptionID: prescriptionID, "doctor.PhoneNumber": decoded.PhoneNumber },
            { 
            $set: { 
                status: 'approved',
                UpdatedTime: new Date().toISOString()
            } 
            }
        );
        if(approvPrescription.modifiedCount === 0){
            return res.status(400).json({message: "Failed to approve prescription"});
        }
        return res.status(200).json({message: "Prescription approved successfully", prescription: approvPrescription});     
    }catch(err){
        return res.status(500).json({message: "Internal server error", error: err.message});
    }
});

module.exports = router;