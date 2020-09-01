const express = require('express');
const practiceHistoryRouter = express.Router();

practiceHistoryRouter
    .route('/')
    .get((req, res) => {
        res.send('ahh skeet skeet')
    })

module.exports = practiceHistoryRouter