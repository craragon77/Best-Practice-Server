const express = require('express');
const userRouter = express.Router();
const bodyParser = express.json();
const UserService = require('../Services/UserService');
const knex = require('knex');
const jsonParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

userRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db')
        UserService.getAllUsers(knexInstance)
        //and there is an issue here for some reason :(
            .then(users => {
                console.log(req.get('Authorization'))
                res.json(users)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const {username, password} = req.body;
        const newUser = {username, password};
        console.log(newUser)
        if(!username){
            res.status(400).json('Username not included in request body; please enter a valid username');
        } else if(username.length < 6 || username.length > 20){
            res.status(400).json('Username must be between 6 and 20 characters');
        } else if (!password){
            res.status(400).json('Password not included in request body; please enter a valid password');
        } else if(password.length < 8 || password.length > 36){
            res.status(400).json('Password must be between 8 and 36 characters');
        } else if(password.startsWith(' ') || password.endsWith(' ')){
            res.status(400).json('Password must not include any spaces');
        } else if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)){
            res.status(400).json('Password must include at least one upper and one lower case character, as well as at least one number and one special character')
        }
        else{
            UserService.hasUserWithUserName(knexInstance, newUser)
                .then(taken => {
                    if(taken){
                        res.status(400).json({
                        error: 'Username already taken. Please try again with a new username'
                        })
                    }
                    return UserService.hashPassword(password)
                        .then(hashedPassword => {
                            const hashedUser = {
                                username,
                                password: hashedPassword
                            }
                            return UserService.postNewUser(knexInstance, hashedUser)
                                .then(user => {
                                    res
                                    .status(201)
                                    .json(user)
                                })
                        })
                })
                .catch(next);
                
        }
    })

userRouter
    .route('/:id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        let userId = req.params.id;
        UserService.getUserById(knexInstance, userId)
            .then(user => {
                if (!user){
                    res.status(404).json({
                        error: {message: `user not found`}
                    })
                } else {
                    res.status(201).json(user);
                }
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db');
        let userId = req.params.id;
        UserService.deleteUsers(knexInstance, userId)
            .then(user => {
                if(!user){
                    res.status(404).json({
                        error: {message: `Unable to delete user; user not found`}
                    })
                } else {
                    //look into why the message doesn't send if the 
                    res.json('User successfully deleted').status(204).end()
                };
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const {username, password} = req.body;
        const userToUpdate = {username, password};
        const userId = req.params.id;
        if(!username || !password || username === null || password === null){
            res.status(400).json('please include a valid username and password')
        } else{
            UserService.updateUsers(knexInstance, userId, userToUpdate)
            .then(user => {
                if(!user){
                    res.status(404).json({error: {message: 'unable to update: user not found'}});
                } 
                else{
                    res.json('user successfully updated').status(204);
                };
            })
            .catch(next);
        };
    })

module.exports = userRouter;