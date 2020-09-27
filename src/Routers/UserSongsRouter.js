const express = require('express');
const userSongsRouter = express.Router();
const UserSongsServices = require('../Services/UserSongsServices');
const jsonParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const userRouter = require('./UserRouter');
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
        const {song_id, difficulty, instrument, desired_hours, comments} = req.body;
        const newUserSongEntry = {song_id, difficulty, instrument, desired_hours, comments};
        
        //if(!user_id ){
            //res.status(400).json('user_id is required');
        if (!song_id){
            res.status(400).json({error: {message: 'song_id is required'}});
        } else if (!difficulty){
            res.status(400).json({error: {message:'a defined difficulty level is required'}});
        }
        else if (!instrument){
            res.status(400).json({error: {message: 'a defined instrument is required'}});
        } else if (!desired_hours){
            res.status(400).json({error: {message: 'you must state your desired hours'}});
        } else {
            newUserSongEntry.user_id = req.user.id
            UserSongsServices.postUserSongs(knexInstance, newUserSongEntry)
                .then(user_song => {
                    console.log(user_song)
                    res.status(201).json(user_song)
                })
                .catch(next)
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
            song_id, difficulty, instrument, 
            desired_hours, comments
        } = req.body;
        const userSongUpdates = {song_id, difficulty, instrument, desired_hours, comments};

        if(!song_id || song_id == ''){
            res.status(400).json('please include a song to update');
        } else if(!difficulty || difficulty == ''){
            res.status(400).json('please include a difficulty level to update information');
        } else if(!instrument || instrument == ''){
            res.status(400).json('please include an instrument to update information')
        } else if(!desired_hours || desired_hours == ''){
            res.status(400).json('please include desired hours to update information')
        } else{
            userSongUpdates.user_id = req.user.id
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

userSongsRouter
    .route('/HistoryById/:id')
    .get(jsonParser, requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const user_id = req.params.id;
        if(!user_id){
            res.status(400).json('Please include a user_id in your query');
        } else {
            UserSongsServices.getAllUserSongHistoryForAUser(knexInstance, user_id)
            .then(songs => {
                if(!songs){
                    res.status(400).json('Please include a valid user_id in your query')
                }else{
                    res.status(200).json(songs)
                }
            })
            .catch(next)
        }
    })
userSongsRouter
    .route('/byId/songs/:id')
    .get(jsonParser, requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const user_id = req.params.id;
        if(!user_id){
            res.status(400).json('Please include a user_id in your query');
        } else {
            UserSongsServices.getAllUserSongsByUserId(knexInstance, user_id)
            .then(songs => {
                if(!songs){
                    res.status(400).json('Please include a valid user_id in your query')
                }else{
                    res.status(200).json(songs)
                }
            })
            .catch(next)
        }
    })
userSongsRouter
    .route('/songHistory/:id')
    .get(jsonParser, requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const song_id = req.params.id
        const user_id = req.user.id
        if(!song_id){
            res.status(400).json('Please include a song_id in your query');
        } else {
            UserSongsServices.getOnlyPracticeHistory(knexInstance, song_id, user_id)
            .then(songs => {
                if(!songs){
                    res.status(400).json('Please include a valid song_id in your query')
                }else{
                    res.status(200).json(songs)
                }
            })
            .catch(next)
        }
    })

userSongsRouter
    .route('/getInfoBySongId/:id')
    .get(jsonParser, requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const song_id = req.params.id;
        const user_id = req.user.id
        if(!song_id || song_id <= 0){
            res.status(400).json('please include a valid song id')
        }else{
            UserSongsServices.getUserSongBySongId(knexInstance, song_id, user_id)
            .then(songs => {
                if(!songs){
                    res.status(400).json('Please include a valid song_id in your query')
                }else{
                    res.status(200).json(songs)
                }
            })
            .catch(next);
        }
    })

userSongsRouter
    .route('/getSongsForHistoryPost/:id')
    .get(requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const user_id = req.params.id;
        if(!user_id || user_id <= 0 || user_id === null){
            res.status(400).json('please include a valid song id')
        }else{
            UserSongsServices.getSongsToLogHours(knexInstance, user_id)
            .then(songs => {
                if(!songs){
                    res.status(400).json('Please include a valid song_id in your query')
                }else{
                    res.status(200).json(songs)
                }
            })
            .catch(next)
        }
    })

    userSongsRouter
    .route('/confirmation/:id')
    .get(jsonParser, requireAuth, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const user_id = req.params.id;
        if(!user_id){
            res.status(400).json('Please include a user_id in your query');
        } else {
            UserSongsServices.simpleGetUserSongsConfirmation(knexInstance, user_id)
            .then(songs => {
                if(!songs){
                    res.status(400).json('Please include a valid user_id in your query')
                }else{
                    res.status(200).json(songs)
                }
            })
            .catch(next)
        }
    })


module.exports = userSongsRouter
