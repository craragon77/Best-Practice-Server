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
    })

module.exports = userRouter;