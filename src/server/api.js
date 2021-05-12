// Simple Express server setup to serve for local testing/dev API server
// require('dotenv').config()

const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
const app = express();
app.use(helmet());
app.use(compression());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;
const DIST_DIR = './dist';

app.use(express.static(DIST_DIR));

app.use(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

const getCases = (req, response) => {
    client.query('SELECT * from salesforce.case;', (err, results) => {
        if (err) throw err;
        response.status(200).json({ "data": results.rows});
    });
}

const updateCase = (req, response) => {
    const { status, case_number } = req.body
    client.query(
        'UPDATE salesforce.case SET status=$1 WHERE casenumber=$2',
        [status, case_number],
        (error) => {
          if (error) {
            throw error
          }
          response.status(201).json({status: 'success', message: `Case updated with status ${status}.`})
        },
    )
}

app.route('/api/cases').get(getCases).patch(updateCase);

app.listen(PORT, () =>
    console.log(
        `✅  API Server started: http://${HOST}:${PORT}/api/v1/endpoint`
    )
);