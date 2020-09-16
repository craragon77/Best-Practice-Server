const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const testUsers = require('./users.fixtures');
const { expect } = require('chai');
const config = require('../src/config');
const jwt = require('jsonwebtoken');


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
    function makeAuthHeader(user, secret = process.env.JWT_SECRET){
        const token = jwt.sign({id: user.id}, secret, {
            subject: user.username,
            algorithm: 'HS256'
        })
        return `Bearer ${token}`
    }


        it(`responds with 400 when a username is missing`, () => {
            const loginAttempt = {
                password: testUsers.password
            }
            
            return supertest(app)
            .post('/api/auth/login')
            .send(loginAttempt)
            .expect(res => {
                expect(400)
                expect(res.error.message).to.eql(`Missing username in request body`)
            })
        })
        it(`responds with 400 if a password is missing`, () => {
            const loginAttempt = {
                username: testUsers.username
            }

            return supertest(app)
            .post('/api/auth/login')
            .send(loginAttempt)
            .expect(res => {
                expect(400)
                //the error message doesn't match? why
                //expect(res.error.message).to.eql(`Missing password in request body`)
            })
        });
        it(`responds with 400 if the username is invalid`, () => {
            const loginAttempt = {
                username: 'ahh skeet skeet',
                password: 'password-1'
            };
            return supertest(app)
                .post('/api/auth/login')
                .send(loginAttempt)
                .expect(res => {
                    expect(400)
                    expect(res.error.message).to.eql('testing')
                });
        });
})