const express = require('express');
const practiceHistoryRouter = express.Router();
const knex = require('knex');
const PracticeHistoryServices = require('../Services/PracticeHistoryServices');
const jsonParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

practiceHistoryRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        PracticeHistoryServices.getAllPracticeHistory(knexInstance)
            .then(history => {
                res.json(history)
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const {song_practiced, start_time, end_time} = req.body;
        const newPracticeEntry = {song_practiced, start_time, end_time};
        if(!song_practiced || song_practiced == null || song_practiced == ''){
            res.status(400).json('Please include the song that you practiced')
        } else if (!start_time){
            res.status(400).json('Please include a valid start date')
        } else if (!end_time){
            res.status(400).json('Please include a valid end date')
        }else {
            console.log(newPracticeEntry);
            PracticeHistoryServices.postPracticeHistory(knexInstance, newPracticeEntry)
                .then(practice => {
                    res.status(201).json(practice);
                })
                .catch(next);
        }
    })
practiceHistoryRouter
    .route('/:id')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        let p_h_id = req.params.id;
        PracticeHistoryServices.getPracticeHistoryFromId(knexInstance, p_h_id)
            .then(history => {
                if(!history){
                    res.status(404).json({error:{ message: 'practice sesson not found'}});
                }
                else{
                    res.status(201).json(history);
                }
            })
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db');
        const p_h_id = req.params.id;
        PracticeHistoryServices.deletePracticeHistory(knexInstance, p_h_id)
            .then(history => {
                if(!history){
                    res.status(404).json({error:{message: 'practice history not found'}});
                } else{
                    res.json('practice history successfully!').status(204).end();
                }
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const p_h_id = req.params.id;
        const {song_practiced, start_time, end_time} = req.body;
        let practiceHistoryChanges = {song_practiced, start_time, end_time};

        if(!song_practiced || song_practiced == ' '){
            res.status(400).json('Please include a song to update');
        } else if(!start_time || start_time == ' '){
            res.status(400).json('Please include a start time to update');
        } else if (!end_time || end_time == ' '){
            res.status(400).json('Please include an end time to update');
        } else {
            PracticeHistoryServices.updatePracticeHistory(knexInstance, p_h_id, practiceHistoryChanges)
                .then(history => {
                    console.log(history)
                    if(!history){
                        res.status(404).json('practice history not found');
                    } else {
                        //why is it that the message only sends if .json() is sent after the status
                        res.json('practice history updated successfully!').status(204);
                    }
                })
                .catch(next)
        }
    })

/*practiceHistoryRouter
    .router('/historyBySongId/:id')
    .get(requireAuth, jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const song_id = req.params.id;
        if(song_id === null || song_id <= 0){
            res.status(400).json('please enter a valid song_id')
        }else{
            PracticeHistoryServices
        }
    }) */

module.exports = practiceHistoryRouter