const express = require('express');
const practiceHistoryRouter = express.Router();
const knex = require('knex');
const PracticeHistoryServices = require('../Services/PracticeHistoryServices');
const PracticeHistory = require('../Services/PracticeHistoryServices');

practiceHistoryRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        PracticeHistoryServices.getAllPracticeHistory(knexInstance)
            .then(history => {
                res.json(history)
            })
            .catch(next);
    });

module.exports = practiceHistoryRouter