const express = require('express');
const userSongsRouter = express.Router();
const UserSongsServices = require('../Services/UserSongsServices');
const jsonParser = express.json();
const {requireAuth} = require('../middleware/basic-auth');
//reminder: this one where users can log the songs they are working on!
userSongsRouter
    .route('/')
    .all(requireAuth)
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
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const {user_id, song_id, difficulty, instrument, desired_hours, comments} = req.body;
        const newUserSongEntry = {user_id, song_id, difficulty, instrument, desired_hours, comments};
        if(!user_id ){
            res.status(400).json('user_id is required');
        } else if (!song_id){
            res.status(400).json('song_id is required');
        } else if (!difficulty){
            res.status(400).json('a defined difficulty level is required');
        }
        else if (!instrument){
            res.status(400).json('a defined instrument is required');
        } else if (!desired_hours){
            res.status(400).json('you must state your desired hours');
        } else {
            UserSongsServices.postUserSongs(knexInstance, newUserSongEntry)
                .then(user_song => {
                    console.log(user_song)
                    res.status(201).json(user_song)
                })
        }
    })
userSongsRouter
    .route('/:id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        let userSongId = req.params.id;
        UserSongsServices.getUserSongById(knexInstance, userSongId)
            .then(user_song => {
                if(!user_song){
                    res.status(404).json({
                        error: {message: 'user_song not found'}
                    })
                } else {
                    res.status(201).json(user_song)
                }
            })
            .catch(next);
    })
    .delete((req, res, next) =>{
        const knexInstance = req.app.get('db');
        let userSongId = req.params.id;
        UserSongsServices.deleteUserSongs(knexInstance, userSongId)
            .then(user_song => {
                if(!user_song){
                    res.status(404).json('Unable to delete user_song; user_song not found');
                } else {
                    res.json('user_song successfully deleted').status(204).end();
                };
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) =>{
        const knexInstance = req.app.get('db');
        const userSongId = req.params.id;
        const {
            user_id, song_id, difficulty, instrument, 
            desired_hours, comments
        } = req.body;
        const userSongUpdates = {user_id, song_id, difficulty, instrument, desired_hours, comments};
        if(!user_id || user_id == ''){
            res.status(400).json('please include a user_id to update');
        } else if(!song_id || song_id == ''){
            res.status(400).json('please include a song to update');
        } else if(!difficulty || difficulty == ''){
            res.status(400).json('please include a difficulty level to update information');
        } else if(!instrument || instrument == ''){
            res.status(400).json('please include an instrument to update information')
        } else if(!desired_hours || desired_hours == ''){
            res.status(400).json('please include desired hours to update information')
        } else{
            UserSongsServices.updateUserSongs(knexInstance, userSongId, userSongUpdates)
                .then(user_song => {
                    if(!user_song){
                        res.status(404).json('user_song cannot be found');
                    } else{
                        res.json('user_song updated successfully').status(201);
                    }
                })
                .catch(next)
        };
    })


module.exports = userSongsRouter
