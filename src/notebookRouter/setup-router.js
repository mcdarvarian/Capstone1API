const express = require('express');
const winston = require('winston');
const SS = require('./setup-service');

const notebookRouter = express.Router();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'info.log' })
    ]

});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

//this is called once at the beginning of a session in order to keep any 
//changes to tabs in the future less of a pain to deal with
notebookRouter
    .route('/')
    .get((req, res) =>{
        SS.getTabs(req.app.get('db'))
        .then(tabs =>{
            res.json(tabs);
        });
    });

module.exports = notebookRouter;