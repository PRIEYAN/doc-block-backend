const express = require('express');
const cors = require('cors');
require('dotenv').config();

const newPrescription = require('./newPrescription.js');
// const history = require('./history.js'); // Uncomment and require when you have a history module

const router = express.Router();
router.use(cors());
router.use(express.json());

// Mount sub-routers
router.use('/new', newPrescription);
// router.use('/history', history); // Uncomment when you have a history module

// Health check for prescription service
router.get('/', (req, res) => {
    res.status(200).json({ message: "Prescription Service is running" });
});

module.exports = router;