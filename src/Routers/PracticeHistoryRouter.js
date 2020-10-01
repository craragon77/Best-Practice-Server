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
        const {song_practiced, practice_date, practice_hours} = req.body;
        const newPracticeEntry = {song_practiced, practice_date, practice_hours};
        if(!song_practiced ||  song_practiced == ''){
            res.status(400).json('Please include the song that you practiced')
        } else if (!practice_hours){
            res.status(400).json('Please include a the number of hours you practiced')
        }else {
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
            .catch(next);
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
        const {song_practiced, practice_date, practice_hours} = req.body;
        let practiceHistoryChanges = {song_practiced, practice_date, practice_hours};

        if(!song_practiced || song_practiced == ' '){
            res.status(400).json('Please include a song to update');
        } else if(!practice_date || practice_date == ' '){
            res.status(400).json('Please include a date to update');
        } else if (!practice_hours || practice_hours == ' '){
            res.status(400).json('Please include hours to update');
        } else {
            PracticeHistoryServices.updatePracticeHistory(knexInstance, p_h_id, practiceHistoryChanges)
                .then(history => {
                    if(!history){
                        res.status(404).json('practice history not found');
                    } else {
                        res.json('practice history updated successfully!').status(204);
                    }
                })
                .catch(next)
        }
    })

module.exports = practiceHistoryRouter