const express = require('express');
const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .post('/login', jsonParser, (req, res, next) => {
        const {username, password} = req.body;
        const loginUser = {username, password};

        for(const [key, value] of Object.entries(loginUser))
            if(value == null)
            return res.status(400).json({
                error: `Missing ${key} in request body`
            })
        res.send('ok')
    })

module.exports = authRouter;