const express = require('express');
const userRouter = express.Router();
const bodyParser = express.json();
const UserService = require('../Services/UserService');
const knex = require('knex');

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

module.exports = userRouter;