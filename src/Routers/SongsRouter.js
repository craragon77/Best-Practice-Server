const express = require('express');
const songsRouter = express.Router();
const SongsService = require('../Services/SongsService');
const knex = require('knex');
const jsonParser = express.json();

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
.post(jsonParser, (req, res, next) => {
    //come back to this because I have a few ideas of how we can improve this with an API
    const knexInstance = req.app.get('db');
    const {title, composer} = req.body;
    const newSong = {title, composer};
    if(!title || title == ''){
        res.status(400).json('all new songs must include the title of the piece')
    } else {
        res.send('oh snap')
    }
})

module.exports = songsRouter;