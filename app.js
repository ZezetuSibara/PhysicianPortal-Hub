// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample data (replace this with your actual database integration)
let patients = [];

// Routes
// Homepage route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes for CRUD operations on patients
// Get all patients
app.get('/api/patients', (req, res) => {
    res.json(patients);
});

// Add a new patient
app.post('/api/patients', (req, res) => {
    const newPatient = req.body;
    patients.push(newPatient);
    res.status(201).json(newPatient);
});

// Update an existing patient
app.put('/api/patients/:id', (req, res) => {
    const id = req.params.id;
    const updatedPatient = req.body;
    patients[id] = updatedPatient;
    res.json(updatedPatient);
});

// Delete a patient
app.delete('/api/patients/:id', (req, res) => {
    const id = req.params.id;
    patients.splice(id, 1);
    res.sendStatus(204);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

