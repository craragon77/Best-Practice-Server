const express = require('express');
const userSongsRouter = express.Router();
const UserSongsServices = require('../Services/UserSongsServices');
const jsonParser = express.json();
//reminder: this one where users can log the songs they are working on!
userSongsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        UserSongsServices.getAllUserSongs(knexInstance)
        //apparently according to the testing file there is an issue here somewhere
            .then(userSongs => {
                console.log(userSongs)
                res.json(userSongs)
            })
            .catch(next);
    })

module.exports = userSongsRouter
