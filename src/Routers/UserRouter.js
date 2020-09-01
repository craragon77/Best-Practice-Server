const express = require('express');
const userRouter = express.Router();
const bodyParser = express.json();
const UserService = require('../Services/UserService');
const knex = require('knex');

userRouter
    .route('/')
    .get((req, res) => {
        const knexInstance = req.app.get('db')
        UserService.getAllUsers(knexInstance)
            .then(users => {
                res.send(users)
            })
            .catch(next)
    })

module.exports = userRouter;