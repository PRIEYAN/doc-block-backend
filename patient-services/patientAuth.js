const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const web3 = require('web3');
require('dotenv').config();
require('../database/patientDB.js');

const router = express.Router();
router.use(cors());
router.use(express.json());

const mongoURL = process.env.MONGOURL;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(mongoURL)
    .then(() => {
        console.log("Connected to MongoDB (patientAuth)");
    })
    .catch((err) => {   
        console.error("MongoDB connection error:", err);
    });

const Patient = mongoose.model('patientInfo');  

router.get('/',(req,res)=>{
    return res.status(200).json({message: "Patient Auth Service is running"});
});

router.post('/signin',async(req,res)=>{
    try{
        const{name,PhoneNumber,email,password,adharNumber,dob,otherDetails} = req.body;
        if(!name || !PhoneNumber || !email || !password || !adharNumber || !dob ){
            return res.status(400).json({message: "All fields are required"});
        }
        const existingPatient = await Patient.find({ email: email });
        if(existingPatient.length > 0){
            return res.status(400).json({message: "Patient already exists, please login"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newPatient = new Patient({
            name,
            PhoneNumber: PhoneNumber,
            email,
            password: hashedPassword,
            adharNumber,
            dob,
            otherDetails: otherDetails || ''
        });
        await newPatient.save();
        const token = jwt.sign({ name, PhoneNumber, email }, JWT_SECRET, { expiresIn: '1d' });
        return res.status(201).json({ message: "Patient registered successfully", token });
    }catch(error){
        return res.status(500).json({message: "Internal server error", error: error.message});
    }   
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const patient = await Patient.findOne({ email: email });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, patient.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ name: patient.name, PhoneNumber: patient.PhoneNumber, email: patient.email }, JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


module.exports = router;

