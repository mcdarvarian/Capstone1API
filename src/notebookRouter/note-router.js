const express = require('express');
const winston = require('winston');
const notebookRouter = express.Router();
const NS = require('./note-service');

const logger = winston.createLogger();

notebookRouter
    .route('/:note_id')
    .get((req, res)  =>{
        const {note_id} = req.params;
        NS.getNoteById(req.app.get('db'), note_id)
        .then(note =>{
            if(!note){
                logger.error(`note with id ${note_id} not found`)
                res.status(404).send('note not found');
            }
        
            res.json(note);
        })
    })
    .post((req,res) => {
        
    })
    .patch((req, res) =>{

    })
    .delete((req, res) =>{

    })

module.exports = notebookRouter;