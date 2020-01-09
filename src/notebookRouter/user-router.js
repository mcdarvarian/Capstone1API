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
    //.all(requireAuth)
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
                res.status(401).send('User Not Found')
            } else {
                US.loginUser(req.app.get('db'), tokenUserName, tokenPassword)
                    .then(user => {
                        //console.log(user);
                        if (!user) {
                            res.status(401).send('User Not Found')
                        } else {
                            res.status(200).json(user);
                        }

                    })
            }
        }
    })

notebookRouter
    .route('/signUp')
    .post(bodyParser, (req, res, next) => {
        //console.log('in');
        let user = req.get('authorization');
        //console.log(user);
        user = user.slice('basic '.length, user.length);
        const [tokenUserName, tokenPassword] = Buffer
            .from(user, 'base64')
            .toString()
            .split(':')


        if (!tokenUserName || !tokenPassword) {
            res.status(401).json({ error: 'missing username or password' })
        } else {

            const newUser = {
                username: tokenUserName,
                password: tokenPassword
            }
            //console.log(tokenUserName)
            US.findUserByName(req.app.get('db'), tokenUserName)
                .then(userRes => {
                    //console.log('userRes is ', userRes);
                    if (!userRes) {
                        //console.log('not here'); 
                        US.makeUser(req.app.get('db'), newUser)
                            .then(user => {
                                //console.log('done')
                                res.status(201).json(user);
                            })
                            .done();
                    } else {
                        //console.log('here');
                        res.status(401).send('user already exists');
                    }
                })

        }
    })

notebookRouter
    .route('/admin')
    .delete(bodyParser, (req, res, next) => {
        //console.log('here')
        let { username, password, admin_key } = req.body;
        //console.log('adk',  admin_key);
        admin_key = Buffer.from(admin_key, 'base64')
            .toString()
        //console.log(admin_key);
        if (!username || !password || !admin_key) {
            console.log(1)
            res.status(401).json({ error: 'missing required fields' })
        } else if (admin_key !== process.env.admin_key) {
            console.log(2)
            res.status(401).json({ error: 'ur not an admin' });
        } else {
            US.loginUser(req.app.get('db'), username, password)
                .then(user => {
                    //console.log(user);
                    if (!user) {
                        res.status(401).json({ error: 'missing user' });
                    } else {
                        US.deleteUser(req.app.get('db'), username, password)
                            .then(user => {
                                console.log(3)
                                res.status(204).json(user);
                            })
                    }

                })
        }
    })
    .patch(bodyParser, (req, res) => {
        //console.log('in');
        let { old_username, new_username, new_password, admin_key } = req.body;
        admin_key = Buffer.from(admin_key, 'base64').toString();
        /*console.log(old_username);
        console.log(new_username);
        console.log(new_password);
        console.log(admin_key);*/
        if (!old_username || !new_username || !new_password || !admin_key) {
            //console.log('1')
            res.status(401).json({ error: 'missing required fields' })
        } else if (admin_key !== process.env.admin_key) {
            //console.log('2');
            res.status(401).json({ error: 'ur not an admin' });
        } else {
            //console.log('out');
            US.findUserByName(req.app.get('db'), old_username)
                .then(user => {
                    //console.log(user);
                    if (!user) {
                        res.status(401).json({ error: 'missing user' });
                    } else {
                        US.updateUser(req.app.get('db'), old_username, new_username, new_password)
                            .then(user => {
                                res.status(204).json(user);
                            })
                    }
                })
        }
    })

module.exports = notebookRouter;