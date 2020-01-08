const express = require('express');
const winston = require('winston');
const notebookRouter = express.Router();
const NS = require('./note-service');
const bodyParser = express.json();
const xss = require('xss');
const {requireAuth} = require('../basicAuth')

const logger = winston.createLogger();

function SanitizeNote(note){
    return ({
        id: note.id,
        game_id: note.game_id,
        tab_id: note.tab_id,
        title: xss(note.title),
        contents: xss(note.contents)
    })
}

//route to get all notes
notebookRouter
    .route('/')
    //.all(requireAuth)
    .get((req, res) =>{
        NS.getAllNotes(req.app.get('db'))
            .then(notes =>{
                if(!notes){
                    logger.error(`no notes exist`)
                    res.status(404).send('no notes');
                }
                safeNotes = notes.map(note => SanitizeNote(note));
                res.json(safeNotes);
            })
    })

//route of a note tab to access the contents of a single note
notebookRouter
    .route('/:note_id')
    //.all(requireAuth)
    .get((req, res)  =>{
        const {note_id} = req.params;
        NS.getNoteById(req.app.get('db'), note_id)
        .then(note =>{
            if(!note){
                logger.error(`note with id ${note_id} not found`)
                res.status(404).send('note not found');
            }
        
            res.json(SanitizeNote(note));
        })
    })
    //this route lets you update a note with whatever information you want
    .patch(bodyParser, (req, res) =>{
        let {note_id} = req.params;
        let {  title, contents } = req.body;
        if(!note_id || !title || !contents){
            logger.error('update missing required fields');
            res.status(400).send('bad update');
        } else {
            
            NS.getNoteById(req.app.get('db'), note_id)
            .then(note1 =>{
                const newNote= {game_id: note1.game_id, tab_id: note1.tab_id, title, contents}
                NS.updateNotebyId(req.app.get('db'), note_id, newNote )
                .then(note =>{
                    if(!note){
                        logger.error(`note with ${id} not found`);
                        res.status(400).send('not found')
                    } else {
                        res.status(202).json(SanitizeNote(note));
                    }
                })
            })
            
        }
    })

    //this route lets you delete a note 
    .delete((req, res) =>{
        const {note_id} = req.params;
        NS.deleteNote(req.app.get('db'), note_id)
            .then(note =>{
                if(!note){
                    logger.error(`note with id ${note_id} not found`);
                    res.status(400).send('not found');
                } else {
                    res.status(204).json(note);
                }
            })
    })

module.exports = notebookRouter;