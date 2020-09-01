const app = require('./app');
const {PORT} = require('./config');
const knex = require('knex');

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})