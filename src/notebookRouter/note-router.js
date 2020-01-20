const express = require('express');
const winston = require('winston');
const notebookRouter = express.Router();
const NS = require('./note-service');
const US = require('./user-service');
const bodyParser = express.json();
const xss = require('xss');
const { requireAuth } = require('../basicAuth');

const logger = winston.createLogger();

//this makes sure the notes are stable and wont cause any xss problems
function SanitizeNote(note) {
    if (!note) {
        return ({});
    }
    return ({
        id: note.id,
        game_id: note.game_id,
        tab_id: note.tab_id,
        title: xss(note.title),
        contents: xss(note.contents)
    });
}

//route to get all notes
notebookRouter
    .route('/')
    //.all(requireAuth) disabled for a few bugs that havent been ironed out yet
    .get((req, res) => {
        NS.getAllNotes(req.app.get('db'))
            .then(notes => {
                if (notes.length === 0) {
                    //logger.error(`no notes exist`)
                    res.status(404).send('no notes');
                } else {
                    safeNotes = notes.map(note => SanitizeNote(note));
                    res.json(safeNotes);
                }
            })
    });


notebookRouter
    .route('/user')
    //.all(requireAuth) disabled for a few bugs that havent been ironed out yet
    .get((req, res) => {
        let user = req.get('authorization')
        if (!user) {
            res.status(404).json({ error: 'User Not Found' })
        } else {
            user = user.slice('basic '.length, user.length);
            const [tokenUserName, tokenPassword] = Buffer
                .from(user, 'base64')
                .toString()
                .split(':')

            if (!tokenUserName || !tokenPassword) {
                res.status(401).send('Not logged in')
            } else {
                US.findUserByName(req.app.get('db'), tokenUserName)
                    .then(user => {
                        if (!user) {
                            res.status(401).send('User Not Found')
                        } else {
                            NS.getNoteByUser(req.app.get('db'), user.id)
                                .then(notes => {
                                    safeNotes = notes.map(note => SanitizeNote(note));
                                    res.status(200).json(safeNotes)
                                })
                        }
                    })

            }

        }
    });
//route of a note tab to access the contents of a single note

notebookRouter
    .route('/:note_id')
    //.all(requireAuth) disabled for a few bugs that havent been ironed out yet
    .get((req, res) => {
        const { note_id } = req.params;

        NS.getNoteById(req.app.get('db'), note_id)
            .then(note => {
                if (!note) {
                    //logger.error(`note with id ${note_id} not found`)
                    res.status(404).send('note not found');
                } else {
                    res.json(SanitizeNote(note));
                }


            });
    })
    
    //this route lets you update a note with whatever information you want
    .patch(bodyParser, (req, res) => {
        let { note_id } = req.params;
        let { title, contents } = req.body;
        if (!note_id || !title || !contents) {
            //logger.error('update missing required fields');
            res.status(400).send('bad update');
        } else {

            NS.getNoteById(req.app.get('db'), note_id)
                .then(note1 => {
                    if (!note1) {
                        //logger.error(`note with id ${note_id} not found`)
                        res.status(404).send('note not found');
                    } else {
                        const newNote = { game_id: note1.game_id, tab_id: note1.tab_id, title, contents }
                        NS.updateNotebyId(req.app.get('db'), note_id, newNote)
                            .then(note => {
                                if (!note) {
                                    logger.error(`note with ${id} not found`);
                                    res.status(400).send('not found')
                                } else {
                                    res.status(202).json(SanitizeNote(note[0]));
                                }
                            })
                    }
                })

        }
    })

    //this route lets you delete a note 
    .delete((req, res) => {
        const { note_id } = req.params;
        NS.deleteNote(req.app.get('db'), note_id)
            .then(note => {
                if (!note) {
                    logger.error(`note with id ${note_id} not found`);
                    res.status(404).send('not found');
                } else {
                    res.status(204).json(note);
                }
            });
    });

module.exports = notebookRouter;