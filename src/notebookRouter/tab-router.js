const express = require('express');
const winston = require('winston');
const notebookRouter = express.Router();
const NBS = require('./tab-service');
const US = require('./user-service');
const bodyParser = express.json();
const {requireAuth} = require('../basicAuth');

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
                res.json(data)
            })

    })
    //this route makes a new game in the database
    .post(bodyParser, (req, res, next) => {
        
        let token = req.get('authorization');
        token = token.slice('basic '.length, token.length)
        const [tokenUserName, tokenPassword] = Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
        US.findUserByName(req.app.get('db'), tokenUserName)
        .then(user =>{
            if(!user){
                res.status(400).send('bad request');
            } else {
                const {gamename } = req.body;
                if (!gamename) {
                    logger.error('missing game requirements')
                    res.status(400).send('bad request');
                } else {
                    const users_id = user.id;
                    newGame = { users_id, gamename };
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
    //.all(requireAuth)
    .get((req, res) =>{
        const game_id = req.params;
        if(!game_id){
            logger.error('missing note requirements');
            res.status(404).send('missing requirements');
        } else {
            NBS.getNotesByGame(req.app.get('db'), game_id.game_id)
                .then(notes =>{
                    res.json(notes);
                })
        }
    })

notebookRouter
    .route('/:game_id')
    //.all(requireAuth)
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
                NBS.getNotesByTab(req.app.get('db'), 1)
                    .then(data => {
                        if (!errors) {
                            res.json(data);
                        }
                    })
            })
    })
    //this route also lets you delete a game if you want 
    .delete((req, res) => {
        const {game_id} = req.params;
        NBS.deleteGame(req.app.get('db'), game_id)
        .then(game =>{
            if(!game){
                logger.error(`game with id ${game_id} not found`);
                res.status(400).send('game not found');
            } else {
                res.status(204).json(game);
            }
        })
    })
    

//route of the tabs page to see all notes within a tab
notebookRouter
    .route('/:game_id/:tab_id')
    //.all(requireAuth)
    .get((req, res) => {
        let errors = false;
        const { game_id, tab_id } = req.params;
        NBS.getNotesByGameAndTab(req.app.get('db'), game_id, tab_id)
        .then(notes =>{
            res.json(notes);
        })
    })
    //this lets you put a new note in a tab
    .post(bodyParser, (req, res, next) => {
        let { tab_id, game_id, title, contents } = req.body;
        if (!tab_id || !game_id || !title || !contents) {
            logger.error('missing note requirements');
            res.status(400).send('bad request');
        } else {
            /*let id = uuid();
            if(!id){
                logger.error('missing note requirements');
                res.status(400).send('bad request');
            }*/
            const newNote = {/* id,*/ tab_id, game_id, title, contents }
            NBS.makeNote(req.app.get('db'), newNote)
                .then(note => {
                    
                    res.status(201).json(note)

                })
                .catch(next);
        }
    })




module.exports = notebookRouter;