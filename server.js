const express = require('express');
const cors = require('cors');
require('dotenv').config();

const doctorAuth = require('./docter-services/auth-services/doctorAuth.js');
const prescription = require('./docter-services/doctor-core-services/prescription.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/doctor/auth', doctorAuth);
app.use('/doctor/prescription',prescription);



app.get('/', (req, res) => {
    return res.status(200).json({ message: "App running" });
});

const PORT = 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/*
http://localhost:5050/doctor/auth/signin
http://localhost:5050/doctor/auth/login
http://localhost:5050/doctor/auth/logout


http://localhost:5050/doctor/prescription/newPrescription - to create new prescription

http://localhost:5050/doctor/prescription/getPrescriptionDetails - to get all prescription details of a doctor
http://localhost:5050/doctor/prescription/rejectPrescription - to reject a prescription

http://localhost:5050/doctor/prescription/prescriptionRequest - to approve a prescription request

*/