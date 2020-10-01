const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const testUsers = require('./users.fixtures');
const { expect } = require('chai');
const config = require('../src/config');
const jwt = require('jsonwebtoken');



describe('Protected Endpoints', () => {
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
    it(`returns 401 if there isn't a token`, () => {
        const missingToken = {
            username: 'username',
            password: 'password'
        };
        return supertest(app)
        .get('/api/users')
        .expect(401)
        
    });
    it(`returns a 401 if the token isn't valid`, () => {
        const user = {
            username: 'username',
            password: 'password'
        };
        const invalidToken = 'bearer 12345'
        return supertest(app)
        .get('/api/users')
        .set('Authorization', invalidToken)
        .expect(401);
    });
    it(`returns a 200 if the token is valid`, () => {
        return supertest(app)
        .get('/api/users')
        .set('Authorisation', makeAuthHeader(testUsers[0]))
        .expect(res => {
            expect(200);
            expect(res.error).to.eql('testing')
        });

    })
})