require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config');
const knex = require('knex');
const userRouter = require('./Routers/UserRouter');
const songsRouter = require('./Routers/SongsRouter');
const userSongsRouter = require('./Routers/UserSongsRouter');
const practiceHistroyRouter = require('./Routers/PracticeHistoryRouter');
const config = require('./config');
const authRouter = require('./auth/auth-router');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())



app.get('/', (req,res) => {
    res.send('Hello, Dave')
})

app.use('/api/users', userRouter);
app.use('/api/songs', songsRouter);
app.use('/api/user-songs', userSongsRouter);
app.use('/api/practice-history', practiceHistroyRouter);
app.use('/api/auth', authRouter);

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app