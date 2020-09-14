const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const testUsers = require('./users.fixtures');
const supertest = require('supertest');


describe('User Endpoints', function(){
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
            const token = Buffer.from(`${user.username} : ${user.password}`).toString('base64');
            return `Basic ${token}`
        }
    
    describe.only('Protected endpoints', ()=> {
        it(`responds with 401 'missing basic token' when there isn't a token`, () => {
            return supertest(app)
            .get(`/api/users`)
            .expect(401, {error: `Missing basic token`})
        } )
    })
    
    describe.only('GET /users endoint', () => {
        it('GET /users responds with 200 and all of the users', () => {
        console.log(makeAuthHeader(testUsers[0]))
        return supertest(app)
        .get('/api/users')
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .expect(200)
        });
    });
    describe('POST /users endpoint', () => {
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
                expect(res.body.username).to.eql(newValidUser.username);
                expect(res.body.password).to.eql(newValidUser.password);
                expect(res.body).to.have.property('id');
            })
        })
    });
    describe('GET /users/:id', () => {
        it(`returns a 404 if the user's id cannot be found`, () => {
            let missingId = 12345
            return supertest(app)
            .get(`/users/${missingId}`)
            //why is it that the message isn't sent as part of the code?
            //.expect(404, {error: {message: `user not found`}})
            .expect(404);
        });
        it(`returns a 201 and the user if the id is valid`, () => {
            let validId = 1;
            return supertest(app)
            .get(`/api/users/${validId}`)
            .expect(res => {
                expect(201)
                //console.log(res)
                expect(res.body.id).to.eql(validId)
            })
        })
    });
    describe('DELETE /users/:id', () => {
        it(`returns a 404 if the user's id cannot be found`, () => {
            let invalidUserId = 12345;
            return supertest(app)
            .delete(`/api/users/${invalidUserId}`)
            .expect(res => {
                expect(404);
                expect(res.body.error.message).to.eql(`Unable to delete user; user not found`);
            });
        })
        it(`returns a 204 if the user's id is found and deleted`, () => {
            let validId = 1;
            return supertest(app)
            .delete(`/api/users/${validId}`)
            .expect(res => {
                expect(204);
                expect(res.body).to.eql(`User successfully deleted`);
            });
        });
    });
    describe(`PATCH /users/:id`, () => {
        it('returns 400 if username not included', () =>{
            let missingUsername = {
                id: 1,
                password: 'password',
            }
            return supertest(app)
            .patch(`/api/users/${missingUsername.id}`)
            .send(missingUsername)
            .expect(res => {
                expect(400);
                expect(res.body).to.eql(`please include a valid username and password`);
            });
        });
        it(`returns 400 if password not included`, () => {
            let missingPassword = {
                id: 1,
                username: 'username'
            }
            return supertest(app)
            .patch(`/api/users/${missingPassword.id}`)
            .send(missingPassword)
            .expect(res => {
                expect(400);
                expect(res.body).to.eql('please include a valid username and password');
            });
        });
        it(`updates a user when its valid + returns 204 status`, () => {
            let validUser = {
                id: 1,
                username: 'update',
                password: 'update'
            };
            return supertest(app)
            .patch(`/api/users/${validUser.id}`)
            .send(validUser)
            .expect(res => {
                expect(204);
                expect(res.body).to.eql('user successfully updated');
            });
        })
    })
});