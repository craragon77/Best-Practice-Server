const express = require('express');
const songsRouter = express.Router();

songsRouter
.route('/')
.get((req, res) => {
    res.send('is that Bojack Horseman?!?!?')
})

module.exports = songsRouter;