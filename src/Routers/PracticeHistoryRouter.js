const express = require('express');
const practiceHistoryRouter = express.Router();
const knex = require('knex');
const PracticeHistoryServices = require('../Services/PracticeHistoryServices');
const jsonParser = express.json();

practiceHistoryRouter
    .route('/')
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
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        let p_h_id = req.params.id;
        PracticeHistoryServices.getPracticeHistoryFromId(knexInstance, p_h_id)
            .then(history => {
                if(!history){
                    res.status(404).json({error:{ message: 'practice sesson not found'}})
                }
                else{
                    res.status(201).json(history)
                }
            })
    })

module.exports = practiceHistoryRouter