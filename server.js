const express = require('express');
const cors = require('cors');
require('dotenv').config();

const doctorAuth = require('./docter-services/auth-services/doctorAuth.js');
const newPrescription = require('./docter-services/doctor-core-services/newPrescription.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/doctor/auth', doctorAuth);
app.use('/doctor/core', newPrescription);//for this in that folder there will be another server.js to run those files to get it here



app.get('/', (req, res) => {
    return res.status(200).json({ message: "App running" });
});

const PORT = 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});