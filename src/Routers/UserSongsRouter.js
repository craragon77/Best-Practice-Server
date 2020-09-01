const express = require('express');
const userSongsRouter = express.Router();
const UserSongsServies = require('../Services/UserSongsServices');
//reminder: this one where users can log the songs they are working on!
userSongsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        UserSongsServices.getAllUserSongs(knexInstance)
            .then(userSongs => {
                res.json(userSongs)
            })
            .catch(next)
    })

module.exports = userSongsRouter
