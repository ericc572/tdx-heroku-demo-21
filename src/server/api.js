// Simple Express server setup to serve for local testing/dev API server
require('dotenv').config()

const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');
const Router = require('express-promise-router');
const db = require('../db')

const app = express();
app.use(helmet());
app.use(compression());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3002;
const DIST_DIR = './dist';

app.use(express.static(DIST_DIR));

app.use(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

const getCases = (request, response) => {
    db.query('SELECT * FROM salesforce.case', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

app.route('/api/cases').get(getCases)

app.listen(PORT, () =>
    console.log(
        `✅  API Server started: http://${HOST}:${PORT}/api/v1/endpoint`
    )
);