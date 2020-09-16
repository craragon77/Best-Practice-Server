const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const testUsers = require('./users.fixtures');
const { expect } = require('chai');
const config = require('../src/config');



describe.skip('Protected Endpoints', () => {
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: config.TEST_DATABASE_URL
        });
        app.set('db', db);
    });
    after('disconnect from db', () => db.destroy());
    before('clean the table', () => db.raw('Truncate practice_history, user_songs, songs, users RESTART identity cascade'));
    afterEach('clean the table', () => db.raw('Truncate practice_history, user_songs, songs, users RESTART identity cascade'));
    beforeEach('insert test users', () => {
        return db.into('users').insert(testUsers)
    });
    function makeAuthHeader(user, secret = process.env.JWT_SECRET){
        const token = jwt.sign({id: user.id}, secret, {
            subject: user.username,
            algorithm: 'HS256'
        })
        return `Bearer ${token}`
    }
})