const express = require('express');
const userRouter = express.Router();
const bodyParser = express.json();

userRouter
    .route('/')
    .get((req, res) => {
        res.send('this is a test')
    })

module.exports = userRouter;