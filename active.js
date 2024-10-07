const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'telecom'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected.');
});

// Activate SIM Card
app.post('/activate', (req, res) => {
    const { simNumber } = req.body;
    const query = `UPDATE sim_cards SET status = 'active', activation_date = NOW() WHERE sim_number = ?`;
    db.query(query, [simNumber], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('SIM not found');
        res.status(200).send('SIM activated successfully');
    });
});

// Deactivate SIM Card
app.post('/deactivate', (req, res) => {
    const { simNumber } = req.body;
    const query = `UPDATE sim_cards SET status = 'inactive', activation_date = NULL WHERE sim_number = ?`;
    db.query(query, [simNumber], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('SIM not found');
        res.status(200).send('SIM deactivated successfully');
    });
});

// Get SIM Details
app.get('/sim-details/:simNumber', (req, res) => {
    const { simNumber } = req.params;
    const query = `SELECT * FROM sim_cards WHERE sim_number = ?`;
    db.query(query, [simNumber], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('SIM not found');
        res.status(200).json(result[0]);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

async function activateSIM() {
    const simNumber = document.getElementById('simNumber').value;
    const response = await fetch('/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simNumber })
    });
    const result = await response.text();
    document.getElementById('result').textContent = result;
}

async function deactivateSIM() {
    const simNumber = document.getElementById('simNumber').value;
    const response = await fetch('/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simNumber })
    });
    const result = await response.text();
    document.getElementById('result').textContent = result;
}

async function getSIMDetails() {
    const simNumber = document.getElementById('simNumber').value;
    const response = await fetch(`/sim-details/${simNumber}`);
    const result = await response.json();
    document.getElementById('result').textContent = JSON.stringify(result, null, 2);
}
