const express = require('express');
const userSongsRouter = express.Router();
//reminder: this one where users can log the songs they are working on!
userSongsRouter
    .route('/')
    .get((req, res) => {
        res.send('this is to make sure the user song router thing works')
    })

module.exports = userSongsRouter
