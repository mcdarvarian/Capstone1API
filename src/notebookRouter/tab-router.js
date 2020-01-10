const express = require('express');
const winston = require('winston');
const notebookRouter = express.Router();
const NBS = require('./tab-service');
const US = require('./user-service');
const bodyParser = express.json();
const { requireAuth } = require('../basicAuth');

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

//this route returns all the games in the database
notebookRouter
    .route('/')
    //.all(requireAuth)
    .get((req, res) => {
        NBS.getGames(req.app.get('db'))
            .then(data => {
                //console.log(data);
                res.status(200).json(data)
            })

    })
    //this route makes a new game in the database, using authorization for getting user_id
    .post(bodyParser, (req, res, next) => {
        //get username/pass from auth encryption
        let token = req.get('authorization');
        token = token.slice('basic '.length, token.length)
        const [tokenUserName, tokenPassword] = Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
        US.findUserByName(req.app.get('db'), tokenUserName)
            .then(user => {
                if (!user) {
                    res.status(400).send('bad request');
                } else {
                    const { gamename } = req.body;
                    if (!gamename) {
                        logger.error('missing game requirements')
                        res.status(400).send('bad request');
                    } else {
                        const users_id = user.id;
                        newGame = { users_id, gamename };
                        //console.log(newGame);
                        NBS.makeGame(req.app.get('db'), newGame)
                            .then(game => {
                                res.status(201).json(game)
                            })
                            .catch(next);
                    }
                }
            })

    })

notebookRouter
    //this route gets you all the notes within a game
    .route('/notes/:game_id')
    //.all(requireAuth) disabled for a few bugs that havent been ironed out yet
    .get((req, res) => {
        const game_id = req.params;
        if (!game_id) {
            logger.error('missing note requirements');
            res.status(404).send('missing requirements');
        } else {
            NBS.getGamebyId(req.app.get('db'), game_id.game_id)
                .then(game => {
                    if (!game) {
                        res.status(404).send('game does not exist')
                    } else {
                        NBS.getNotesByGame(req.app.get('db'), game_id.game_id)
                            .then(notes => {
                                res.status(200).json(notes);
                            })
                    }
                })

        }
    })

notebookRouter
    .route('/:game_id')
    //.all(requireAuth) disabled for a few bugs that havent been ironed out yet
    //this route shows all the tabs for the game of game_id, it defaults to the first tab
    .get((req, res) => {
        let errors = false;
        const { game_id } = req.params;
        NBS.getGamebyId(req.app.get('db'), game_id)
            .then(data => {
                if (!data) {
                    logger.error(`game with id ${game_id} not found`);
                    res.status(404).send('game not found');
                    errors = true;
                }
                return data;
            })
            .then(() => {
                NBS.getNotesByGameAndTab(req.app.get('db'),game_id, 1)
                    .then(data => {
                        if (!errors) {
                            res.json(data);
                        }
                    })
            })
    })
    //this route also lets you delete a game if you want 
    .delete((req, res) => {
        const { game_id } = req.params;
        NBS.deleteGame(req.app.get('db'), game_id)
            .then(game => {
                if (!game) {
                    logger.error(`game with id ${game_id} not found`);
                    res.status(404).send('game not found');
                } else {
                    res.status(204).json(game);
                }
            })
    })


//route of the tabs page to see all notes within a tab
notebookRouter
    .route('/:game_id/:tab_id')
    //.all(requireAuth) disabled for a few bugs that havent been ironed out yet
    .get((req, res) => {
        let errors = false;
        const { game_id, tab_id } = req.params;
        //console.log(game_id, tab_id);
        NBS.getGamebyId(req.app.get('db'), game_id)
            .then(data => {
                if (!data) {
                    res.status(404).send('game not found')
                } else {
                    NBS.getNotesByGameAndTab(req.app.get('db'), game_id, tab_id)
                        .then(notes => {
                            res.json(notes);
                        })
                }

            })
    })
    //this lets you put a new note in a tab
    .post(bodyParser, (req, res, next) => {
        let { tab_id, game_id, title, contents } = req.body;
        if (!tab_id || !game_id || !title || !contents) {
            logger.error('missing note requirements');
            res.status(400).send('bad request');
        } else {
            const newNote = {tab_id, game_id, title, contents }
            NBS.getGamebyId(req.app.get('db'), game_id)
                .then(data => {
                    if (!data) {
                        res.status(404).send('game not found')
                    } else {
                        NBS.makeNote(req.app.get('db'), newNote)
                            .then(note => {
                                res.status(201).json(note)
                            })
                            .catch(next);
                    }
                })
        }
    })




module.exports = notebookRouter;