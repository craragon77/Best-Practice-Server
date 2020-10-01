const express = require('express');
const songsRouter = express.Router();
const SongsService = require('../Services/SongsService');
const knex = require('knex');
const jsonParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

songsRouter
.route('/')
.all(requireAuth)
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SongsService.getAllSongs(knexInstance)
        .then(songs => {
            res.json(songs)
        })
        .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {title, composer} = req.body;
    const newSong = {title, composer};
    if(!title || title == ' ' || title == null){
        res.status(400).json('all new songs must include the title of the piece')
    } else if (!composer || composer == ' ' || composer == null){
        res.status(400).json('all new songs must include the composer of the piece')
    }
    else {
        SongsService.postNewSong(knexInstance, newSong)
            .then(song => {
                res.status(201).json(song);
            })
            .catch(next);
    };
})

songsRouter
    .route('/:id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        const songId = req.params.id;
        SongsService.getSongById(knexInstance, songId)
            .then(song => {
                if(!song){
                    res.status(404).json({
                        error: {message: `song not found`}
                    });
                }
                else{
                    res.status(201).json(song)
                }
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db');
        const songId = req.params.id;
        SongsService.deleteSongs(knexInstance, songId)
            .then(song => {
                if(!song){
                    res.status(404).json({
                        error: {message: 'song not found'}
                    });
                }
                else {
                    res.json('song successfully deleted!').status(204)
                }
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const songId = req.params.id;
        const {composer, title} = req.body;
        const songToUpdate = {title, composer};
        if(!title || title === ''){
            res.status(400).json('please include a valid title');
        } else if (!composer || composer === ''){
            res.status(400).json('please include a valid composer');
        } else {
            SongsService.updateSongs(knexInstance, songId, songToUpdate)
                .then(song => {
                    if(!song){
                        res.status(404).json('song cannot be found');
                    } else {
                        res.json('song updated successfully').status(204);
                    }
                })
                .catch(next)
        }
    })
songsRouter
    .route('/ById/:id')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const userId = req.params.id
        if(!userId || userId < 1 || userId == null){
            res.status(400).json('Please include a valid user_id as a param')
        } else {
            SongsService.getAllSongByUserId(knexInstance, userId)
                .then(song => {
                    if(!song){
                        res.status(400).json('no songs could be found under that id')
                    } else {
                        res.status(200).json(song)
                    }
                })
                .catch(next)
        }
    })

songsRouter
    .route('/byName/:title')
    .get(requireAuth, jsonParser,(req, res, next) => {
        const knexInstance = req.app.get('db');
        const title = req.params.title
        if(!title || title == null || title == " "){
            res.status(400).json('please use a valid tearm for your search')
        }
        SongsService.getSongsByTerms(knexInstance, title)
            .then(songs => {
                if(!songs){
                    res.status(404).json('unfortunately no songs by that name can be found at this time');
                } else{
                    res.status(200).json(songs);
                }
            })
            .catch(next);
    })

module.exports = songsRouter;