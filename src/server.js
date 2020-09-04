const app = require('./app');
const {PORT} = require('./config');
const knex = require('knex');
const config = require('../src/config');


const db = knex({
    client: 'pg',
    connection: config.DATABASE_URL
})

app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})