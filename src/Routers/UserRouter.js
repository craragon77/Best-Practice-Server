const express = require('express');
const userRouter = express.Router();
const bodyParser = express.json();
const UserService = require('../Services/UserService');
const knex = require('knex');
const jsonParser = express.json();

userRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UserService.getAllUsers(knexInstance)
        //and there is an issue here for some reason :(
            .then(users => {
                console.log(users)
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
            res.status(400).json('Username not included in request body; please enter a valid username')
        } else if(username.length < 6 || username.length > 20){
            res.status(400).json('Username must be between 6 and 20 characters')
        } else if (!password){
            res.status(400).json('Password not included in request body; please enter a valid password')
        } else if(password.length < 8 || password.length > 36){
            res.status(400).json('Password must be between 8 and 36 characters')
        }
        else{
            UserService.postNewUser(knexInstance, newUser)
                .then(user => {
                    console.log(user)
                    res.status(201).json(user)
                    //trouble spot here ^^^^
                })
                .catch(next);
        }
        

    })

module.exports = userRouter;