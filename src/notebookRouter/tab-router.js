const express = require('express');
const winston = require('winston');
const notebookRouter = express.Router();
const NBS = require('./tab-service');
const bodyParser = express.json();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'info.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}



//route of the main page to get to different games
notebookRouter
    .route('/')
    .get((req, res) => {
        NBS.getGames(req.app.get('db'))
            .then(data => {
                res.json(data)
            })

    })
    .post(bodyParser, (req, res, next) => {
        console.log(req.body);
        const { id, users_id, gameName } = req.body;
        console.log(id, users_id, gameName);
        if (!id || !gameName) {
            logger.error('missing game requirements')
            res.status(400).send('bad request');
        } else {
            newGame = { id, users_id, gameName };
            NBS.makeGame(req.app.get('db'), newGame)
                .then(game => {
                    res.status(201).json(game)
                })
                .catch(next);
        }
    })

//route of the games page to see different tabs
notebookRouter
    .route('/:game_id')
    .get((req, res) => {
        let errors = false;
        const { game_id } = req.params;
        NBS.getGamebyId(req.app.get('db'), 1)
            .then(data => {
                if (!data) {
                    console.log('wrong')
                    logger.error(`game with id ${game_id} not found`);
                    res.status(404).send('game not found');
                    errors = true;
                }
                return data;
            })
            .then(() => {
                NBS.getTabNotes(req.app.get('db'), 1)
                    .then(data => {
                        if (!errors) {
                            res.json(data);
                        }
                    })
            })
    })
    .delete((req, res) => {

    })

//route of the tabs page to see all notes within a tab
notebookRouter
    .route('/:game_id/:tab_id')
    .get((req, res) => {
        let errors = false;
        const { game_id, tab_id } = req.params;
        NBS.getGamebyId(req.app.get('db'), game_id)
            .then(data => {
                if (!data) {
                    console.log('wrong')
                    logger.error(`game with id ${game_id} not found`);
                    res.status(404).send('game not found');
                    errors = true;
                }
                return data;
            })
            .then(() => {
                NBS.getTabNotes(req.app.get('db'), tab_id)
                    .then(data => {
                        if (!errors) {
                            res.json(data);
                        }
                    })
            })
    })
    .post(bodyParser, (req, res, next) => {
        let { id, tab_id, game_id, title, contents } = req.body;
        console.log(id, game_id, tab_id, title, contents);
        if (!id || !tab_id || !game_id || !title || !contents) {
            logger.error('missing note requirements');
            res.status(400).send('bad request');
        } else {
            const newNote = { id, tab_id, game_id, title, contents }
            NBS.makeNote(req.app.get('db'), newNote)
                .then(note => {
                    res.status(201).json(note)

                })
                .catch(next);
        }
    })

//route of a note tab to see the contents of a note


module.exports = notebookRouter;