const express = require('express');
const winston = require('winston');
const notebookRouter = express.Router();
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

notebookRouter
    .route('/login')
    //.all(requireAuth) disabled for a few bugs that havent been ironed out yet
    //this checked to make sure the logged in user exists
    .get((req, res) => {

        let user = req.get('authorization');
        if (!user) {
            res.status(404).json({ error: 'User Not Found' });
        } else {
            user = user.slice('basic '.length, user.length);
            const [tokenUserName, tokenPassword] = Buffer
                .from(user, 'base64')
                .toString()
                .split(':');

            if (!tokenUserName || !tokenPassword) {
                res.status(401).send('User Not Found');
            } else {
                US.loginUser(req.app.get('db'), tokenUserName, tokenPassword)
                    .then(user => {
                        if (!user) {
                            res.status(401).send('User Not Found');
                        } else {
                            res.status(200).json(user);
                        }

                    });
            }
        }
    });

notebookRouter
    .route('/signUp')
    //this lets anyone create a new user given they have a unique username and password
    .post(bodyParser, (req, res) => {
        let user = req.get('authorization');
        user = user.slice('basic '.length, user.length);
        const [tokenUserName, tokenPassword] = Buffer
            .from(user, 'base64')
            .toString()
            .split(':');


        if (!tokenUserName || !tokenPassword) {
            res.status(401).json({ error: 'missing username or password' })
        } else {

            const newUser = {
                username: tokenUserName,
                password: tokenPassword
            };
            
            US.findUserByName(req.app.get('db'), tokenUserName)
                .then(userRes => {
                    if (!userRes) {   
                        US.makeUser(req.app.get('db'), newUser)
                            .then(user => { 
                                res.status(201).json(user);
                            })
                            .done();
                    } else {
                        res.status(401).send('user already exists');
                    }
                });

        }
    });

notebookRouter
    .route('/admin')
    //deletes a user give you have their name, password and the admin password
    .delete(bodyParser, (req, res) => {
        let { username, password, admin_key } = req.body;
        admin_key = Buffer.from(admin_key, 'base64')
            .toString();
        if (!username || !password || !admin_key) {
            res.status(401).json({ error: 'missing required fields' })
        } else if (admin_key !== process.env.admin_key) {
            res.status(401).json({ error: 'ur not an admin' });
        } else {
            US.loginUser(req.app.get('db'), username, password)
                .then(user => {
                    if (!user) {
                        res.status(401).json({ error: 'missing user' });
                    } else {
                        US.deleteUser(req.app.get('db'), username, password)
                            .then(user => {
                                
                                res.status(204).json(user);
                            });
                    }

                });
        }
    })
    //this lets you change a user's username and password provided you have their current username and the admin password
    .patch(bodyParser, (req, res) => {
        let { old_username, new_username, new_password, admin_key } = req.body;
        admin_key = Buffer.from(admin_key, 'base64').toString();
        if (!old_username || !new_username || !new_password || !admin_key) {
            
            res.status(401).json({ error: 'missing required fields' });
        } else if (admin_key !== process.env.admin_key) {
            
            res.status(401).json({ error: 'ur not an admin' });
        } else {
            
            US.findUserByName(req.app.get('db'), old_username)
                .then(user => {
                    
                    if (!user) {
                        res.status(401).json({ error: 'missing user' });
                    } else {
                        US.updateUser(req.app.get('db'), old_username, new_username, new_password)
                            .then(user => {
                                res.status(204).json(user);
                            });
                    }
                });
        }
    });

module.exports = notebookRouter;