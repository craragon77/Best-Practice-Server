const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const testUsers = require('./users.fixtures');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')


describe.only('User Endpoints', function(){
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
    
    describe('Protected endpoints', ()=> {
        it(`responds with 401 'missing basic token' when there isn't a token`, () => {
            return supertest(app)
            .get(`/api/users`)
            .expect(401, {error: `Missing bearer token`})
        } )
    })
    
    describe('GET /users endoint', () => {
        it('GET /users responds with 200 and all of the users', () => {
        console.log(testUsers[0])
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
            //.set('Authorization', makeAuthHeader(testUsers[0]))
            .send(noUsername)
            .expect(400)

        });
        it(`doesn't post if a user doesn't include a password`, () => {
            const noPassword = {
                username: 'username'
            }
            return supertest(app)
            .post('/api/users')
            //.set('Authorization', makeAuthHeader(testUsers[0]))
            .send(noPassword)
            .expect(400)
        });
        it(`posts successfully when a user includes both a valid name and password`, () => {
            const newValidUser = {
                username: 'Posted_Username',
                password: 'Password1!'
            };
            return supertest(app)
            .post('/api/users')
            //.set('Authorization', makeAuthHeader(testUsers[0]))
            .send(newValidUser)
            .expect(res => {
                expect(201)
                expect(res.body.username).to.eql(newValidUser.username);
                expect(res.body).to.have.property('id');
                return bcrypt.compare(res.password, newValidUser.password)
                .then(compare => {
                    expect(compare).to.be.true
                })
            });
        });
        it(`responds with 400 + error message if password.length > 72 characters`, () => {
            const invalidUser = {
                username: 'username1',
                password: '*'.repeat(73)
            };
            return supertest(app)
            .post('/api/users')
            .send(invalidUser)
            .expect(res => {
                expect(400)
                expect(res.body).to.eql('Password must be between 8 and 36 characters')
            });
        });
        it(`responds with 400 + error messasge if password.length < 8`, () => {
            const invalidUser = {
                username: 'Username1',
                password: 'd'
            }
            return supertest(app)
            .post('/api/users')
            .send(invalidUser)
            .expect(res => {
                expect(400)
                expect(res.body).to.eql('Password must be between 8 and 36 characters')
            });
        });
        it('responds 400 if there are spaces in the front or back of a password', () => {
            const invalidUser = {
                username: 'Username1',
                password: ' Password1! '
            };
            return supertest(app)
            .post('/api/users')
            .send(invalidUser)
            .expect(res => {
                expect(400)
                expect('Password must not include any spaces')
            });
        });
        it('responds with 400 if the password is not complex enough', () => {
            const notComplexPassword = {
                username: 'Username1',
                password: 'Password1!'
            };
            return supertest(app)
            .post('/api/users')
            .send(notComplexPassword)
            .expect(res => {
                expect(400)
                expect('Password must include at least one upper and one lower case character, as well as at least one number and one special character')
            });
        });
        it('responds with 400 if the username is already taken', () => {
            const takenUsername = {
                username: 'Test-user-1',
                password: 'Password-1!'
            };
            return supertest(app)
            .post('/api/users')
            .send(takenUsername)
            .expect(res => {
                expect(400)
                expect()
            });
        }); 
    }); 
    describe('GET /users/:id', () => {
        it(`returns a 404 if the user's id cannot be found`, () => {
            let missingId = 12345
            return supertest(app)
            .get(`/users/${missingId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(404);
        });
        it(`returns a 201 and the user if the id is valid`, () => {
            let validId = 1;
            return supertest(app)
            .get(`/api/users/${validId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
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
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(res => {
                expect(404);
                expect(res.body.error.message).to.eql(`Unable to delete user; user not found`);
            });
        })
        it(`returns a 204 if the user's id is found and deleted`, () => {
            let validId = 1;
            return supertest(app)
            .delete(`/api/users/${validId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
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
            .set('Authorization', makeAuthHeader(testUsers[0]))
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
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingPassword)
            .expect(res => {
                expect(400);
                expect(res.body).to.eql('please include a valid username and password');
            });
        });
        it(`updates a user when its valid + returns 204 status`, () => {
            let validUser = {
                id: 1,
                username: 'Update!',
                password: 'Update!'
            };
            return supertest(app)
            .patch(`/api/users/${validUser.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(validUser)
            .expect(res => {
                expect(204);
                expect(res.body).to.eql('user successfully updated');
            });
        })
    })
});