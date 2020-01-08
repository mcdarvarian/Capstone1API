const express = require('express');
const winston = require('winston');
const notebookRouter = express.Router();
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

notebookRouter
    .route('/login')
    //.all(requireAuth)
        .get((req, res) => {
               
            let user = req.get('authorization')
            user = user.slice('basic '.length, user.length);
            const [tokenUserName, tokenPassword] = Buffer
                .from(user, 'base64')
                .toString()
                .split(':')
            US.loginUser(req.app.get('db'), tokenUserName, tokenPassword)
            .then(user =>{
                res.status(200).json(user);
            })
    })

notebookRouter
    .route('/signUp')
    .post((req, res, next) => {
          
        let user = req.get('authorization')
            user = user.slice('basic '.length, user.length);
            const [tokenUserName, tokenPassword] = Buffer
                .from(user, 'base64')
                .toString()
                .split(':')
            
       
        if(!tokenUserName || !tokenPassword){
            res.status(401).json({error: 'missing username or password'})
        } else {
           
        const newUser = {
            username: tokenUserName,
            password: tokenPassword
        }
        US.findUserByName(req.app.get('db'), tokenUserName)
        .then(user =>{
            if(!user){
                US.makeUser(req.app.get('db'), newUser)
                .then(user =>{   
                    res.status(201).json(user);
                })
                .catch(next);
            } else {
                res.status(401).json({error: 'user already exists'});
            }
        })
       
    }
})

notebookRouter
    .route('/admin')
    .delete(bodyParser, (req, res, next) => {
        let {username, password, admin_key} = req.body;
        admin_key = Buffer.from(admin_key, 'base64')
        .toString()
        if(!username || !password || !admin_key){
            res.status(401).json({error: 'missing required fields'})
        } else if(admin_key !== process.env.admin_key){
            res.status(401).json({error: 'ur not an admin'});
        } else {
            US.deleteUser(req.app.get('db'), username, password)
                .then(user =>{
                    res.status(204).json(user);
                })
        }
    })
    .patch(bodyParser, (req, res) => {
        console.log('in');
        let {old_username, new_username, new_password, admin_key} = req.body;
        admin_key = Buffer.from(admin_key, 'base64').toString();
        console.log(admin_key);
        if(!old_username || !new_username || !new_password || !admin_key){
            console.log('1')
            res.status(401).json({error: 'missing required fields'})
        } else if (admin_key !== process.env.admin_key){
            console.log('2');
            res.status(401).json({error: 'ur not an admin'});
        } else {
            console.log('out');
            US.updateUser(req.app.get('db'), old_username, new_username, new_password)
            .then(user =>{
                res.status(204).json(user);
            })
        }
    })

module.exports = notebookRouter;