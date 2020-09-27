const express = require('express');
const AuthService = require('./auth-service');
const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .post('/login', jsonParser, (req, res, next) => {
        const {username, password} = req.body;
        const loginUser = {username, password};

        if(!username || !username == null){
            return res.status(400).json({
                error: `Missing username in request body`
            })
        } else if (!password || password == null){
            return res.status(400).json({
                error: `Missing password in request body`
            })
        }
        AuthService.getUserWithUserName(req.app.get('db'), loginUser.username)
            .then(dbUser => {
                if(!dbUser)
                    return res.status(400).json({
                        error: 'Database user cannot be found at this time'
                    });
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        //why is it that loginUser.password !== dbUser.password works but !compareMatch doesn't?
                        console.log(dbUser.password, compareMatch)
                        if(!compareMatch){
                            return res.status(400).json({
                                error: 'Incorrect password'
                            })
                        }
                        const sub = dbUser.username;
                        const payload = {id: dbUser.id};
                        res.json({
                            authToken: AuthService.createJwt(sub, payload),
                            user_id: dbUser.id
                        })
                    })
            })
            .catch(next);
    })

module.exports = authRouter;