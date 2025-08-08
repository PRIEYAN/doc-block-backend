const express = require('express'); 
const jwt = require('jsonwebtoken');    
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const router = express.Router();
router.use(cors());
router.use(express.json());
const mongoURL = process.env.MONGOURL;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(mongoURL)
    .then(() => {
        console.log("Connected to MongoDB (jwt)");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    }   
);  

const Doctor = require('../database/doctorDB.js');// 1
const patient =require('../database/patientDB.js');// 2
const Pharmacy = require('../database/pharmacyDB.js');// 3
const hospital = require('../database/hospitalDB.js');// 4
const presecription = require('../database/prescriptionDB.js');// 5

router.post('/:role',async(req,res)=>{
    const{role}=req.params;
    const {token} = req.body;
    if(!token){
        return res.status(400).json({message: "Token is required"});
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        let user;
        if (!decoded.phonenumber) {
            return res.status(400).json({ message: "Token does not contain phonenumber" });
        }
        if (role === '1') {
            user = await Doctor.findOne({ phonenumber: decoded.phonenumber }).select('-password');
        } else if (role === '2') {
            user = await patient?.findOne({ phonenumber: decoded.phonenumber }).select('-password');
        } else if (role === '3') {
            user = await Pharmacy?.findOne({ phonenumber: decoded.phonenumber }).select('-password');
        } else if (role === '4') {
            user = await hospital?.findOne({ phonenumber: decoded.phonenumber }).select('-password');
        }
        else if (role === '5') {
            user = await presecription?.findOne({ phonenumber: decoded.phonenumber , hospital: decoded.hospital });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({message:"jwt working",User:user});
    } catch (error) {
        return res.status(401).json({message: "Invalid token"});
    }
});

module.exports = router;