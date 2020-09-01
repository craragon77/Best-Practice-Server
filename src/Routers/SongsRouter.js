const express = require('express');
const songsRouter = express.Router();
const SongsService = require('../Services/SongsService');
const knex = require('knex');

songsRouter
.route('/')
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SongsService.getAllSongs(knexInstance)
        .then(songs => {
            res.json(songs)
        })
        .catch(next)
})

module.exports = songsRouter;