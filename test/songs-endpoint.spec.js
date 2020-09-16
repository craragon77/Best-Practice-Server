const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const testSongs = require('./songs_endpoints.fixtures');
const supertest = require('supertest');
const config = require('../src/config');
const testUsers = require('./users.fixtures');
const testUserSongs = require('./user_songs.fixtures');
const testPracticeHistory = require('./practice_history.fixtures');
const jwt = require('jsonwebtoken');


describe('Songs Endpoint', function(){
        let db

        before('make knex instance', () => {
            db = knex({
                client: 'pg',
                connection: config.TEST_DATABASE_URL
            });
            app.set('db', db);
        });
        after('disconnect from db', () => db.destroy());
        //computer gets mad when I have a table here
        before('clean the table', () => db.raw('Truncate practice_history, user_songs, songs, users RESTART identity cascade'));
        afterEach('clean tables again', () => db.raw('Truncate practice_history, user_songs, songs, users RESTART identity cascade'));

        beforeEach('insert test users', () => {
            return db.into('users').insert(testUsers);
        })
        beforeEach('insert test songs', () => {
            return db.into('songs').insert(testSongs);
        });
        beforeEach('insert test user_songs', () => {
            return db.into('user_songs').insert(testUserSongs);
        })
        beforeEach('insert test practice_history', () =>{
            return db.into('practice_history').insert(testPracticeHistory);
        })

        function makeAuthHeader(user, secret = process.env.JWT_SECRET){
            const token = jwt.sign({id: user.id}, secret, {
                subject: user.username,
                algorithm: 'HS256'
            })
            return `Bearer ${token}`
        }
    
    describe('GET /songs', () => {
        it('GET /songs responds with 200 and all of the songs', () => {
            return supertest(app)
            .get('/api/songs')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(200)
        });
    });
    describe('GET /songs/:id', () => {
        it('responds with 404 if the song cannot be found', () => {
            let missingId = 12345;
            return supertest(app)
            .get(`/api/songs/${missingId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(404);
        });
        it('responds with the song if the id is valid', () => {
            let validId = 1;
            return supertest(app)
            .get(`/api/songs/${validId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(res => {
                expect(201)
                expect(res.body.id).to.eql(validId);
            });
        });
    })
    describe('POST /songs', () => {
        it('the POST lacks a title', () => {
            let missingTitle = {
                composer: 'The Beatles'
            };
            return supertest(app)
            .post(`/api/songs/`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingTitle)
            .expect(res => {
                expect(400)
                expect(res.body).to.eql('all new songs must include the title of the piece');
            });
        });
        it('the POST lacks a composer', () => {
            let missingComposer = {
                title: 'I Want You'
            };
            return supertest(app)
            .post(`/api/songs`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingComposer)
            .expect(res => {
                expect(400)
                expect(res.body).to.eql(`all new songs must include the composer of the piece`);
            });
        });
        it('the POST meets the requirements', () => {
            let validSong = {
                title: 'I Want You',
                composer: 'The Beatles'
            }
            return supertest(app)
            .post(`/api/songs`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(validSong)
            .expect(res => {
                expect(201);
                expect(res.body.title).to.eql(validSong.title);
                expect(res.body.composer).to.eql(validSong.composer);
            })
        });
    });
    describe('DELETE /songs', () => {
        it(`responds with 400 if the id cannot be found`, () => {
            let missingId = 12345;
            return supertest(app)
            .delete(`/api/songs/${missingId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(res => {
                expect(404);
                expect(res.body.error.message).to.eql(`song not found`);
            });
        })
        it(`responds with 204 if the id can be found`, () => {
            let id = 1;
            return supertest(app)
            .delete(`/api/songs/${id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(res => {
                expect(204);
                expect(res.body).to.eql(`song successfully deleted!`);
            });
        });
    });
    describe('PATCH /songs', () => {
        it('the PATCH lacks a composer', () => {
            let missingComposer = {
                id: 1,
                title: 'I Want You'
            };
            return supertest(app)
            .patch(`/api/songs/${missingComposer.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingComposer)
            .expect(res => {
                expect(400)
                expect(res.body).to.eql(`please include a valid composer`);
            });
        });
        it('the PATCH lacks a title', () => {
            let missingTitle = {
                id: 1,
                composer: 'The Beatles'
            };
            return supertest(app)
            .patch(`/api/songs/${missingTitle.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingTitle)
            .expect(res => {
                expect(400)
                expect(res.body).to.eql(`please include a valid title`);
            });
        });
        it('the PATCH id cannot be found', () => {
            let missingId = {
                id: 12345,
                title: 'I Want You',
                composer: 'The Beatles'
            }
            return supertest(app)
            .patch(`/api/songs/${missingId.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingId)
            .expect(res => {
                expect(404);
                expect(res.body).to.eql('song cannot be found');
            });
        });
        it('the PATCH works with valid information', () => {
            let validPatch = {
                id: 1,
                title: 'I Want You',
                composer: 'The Beatles'
            }
            return supertest(app)
            .patch(`/api/songs/${validPatch.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(validPatch)
            .expect(res => {
                expect(204)
                expect(res.body).to.eql('song updated successfully')
            })
        })
    });
});