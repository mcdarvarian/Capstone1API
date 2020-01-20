require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const app = express();
const TR = require('./notebookRouter/tab-router');
const NR = require('./notebookRouter/note-router');
const setup = require('./notebookRouter/setup-router');
const UR = require('./notebookRouter/user-router');
const knex = require('knex');

db = knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL  //change this to DATABSE_URL
});
app.set('db', db);

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { error };
    }
    res.status(500).json(response);
});

// /note is for when you only care about a note
app.use('/note', NR);
// /setup is for tabs and should only be called once
app.use('/setup', setup);
// /game is for when you care about a game or its specific contents
app.use('/game', TR);
// /user is for getting/creating users
app.use('/user', UR);


app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});

module.exports = app;