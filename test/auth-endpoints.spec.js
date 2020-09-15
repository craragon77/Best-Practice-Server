const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const testUsers = require('./users.fixtures');
const { expect } = require('chai');


describe.only('Auth Endpoints', function(){
    let db

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
    function makeAuthHeader(user){
        const token = Buffer.from(`${user.username}:${user.password}`).toString('base64');
        return `basic ${token}`
    }

    const requiredFields = ['username', 'password'];

    requiredFields.forEach(field => {
        const loginAttempt = {
            username: testUsers.username,
            password: testUsers.password
        }
        it(`responds with 400 when a field is missing`, () => {
            delete loginAttemptBody[field]

            return supertest(app)
            .post(`/api/auth/login`)
            .send(loginAttempt)
            .expect(res => {
                expect(400)
                expect(res.error).to.eql(`Missing ${field} in request body`)
            })
        })
    })
})