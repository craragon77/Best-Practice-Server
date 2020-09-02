const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe('User Endpoints', function(){
    describe('Setting up tests', function(){
        let db

        before('make knex instance', () => {
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DATABASE_URL
            });
            app.set('db', db);
        });
        after('disconnect from db', () => db.destoy());
        before('clean the table', () => db('users').truncate());

        context('Given there are users in the database', () => {
            const testUsers = [
                {
                    id: 1,
                    username: 'test-user-1',
                    password: 'password-1'
                },
                {
                    id: 2,
                    username: 'test-user-2',
                    password: 'password-2'
                },
                {
                    id: 3,
                    username: 'test-user-3',
                    password: 'password-3'
                }
            ];
            beforeEach('insert test users', () => {
                return db.into('users').insert(testUsers)
            });
        });
    })
    describe('GET /users endoint', () => {
        it('GET /users responds with 200 and all of the users', () => {
        return supertest(app)
        .get('/api/users')
        .expect(200)
        });
    });
    describe.only('POST /users endpoint', () => {
        it(`doesn't post if a user doesn't include a username`, () => {
            const noUsername = {
                password: 'password'
            }
            return supertest(app)
            .post('/api/users')
            .send(noUsername)
            .expect(400)

        });
        it(`doesn't post if a user doesn't include a password`, () => {
            const noPassword = {
                username: 'username'
            }
            return supertest(app)
            .post('/api/users')
            .send(noPassword)
            .expect(400)
        });
        it(`posts successfully when a user includes both a valid name and password`, () => {
            const newValidUser = {
                username: 'username',
                password: 'password'
            };
            return supertest(app)
            .post('/api/users')
            .send(newValidUser)
            .expect(res => {
                expect(res.username).to.eql(newValidUser.username);
                expect(password).to.eql(newValidUser.password);
                expect(res).to.have.property('id');
            })
        })
    })
});