const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const testPracticeHistory = require('./practice_history.fixtures');
const supertest = require('supertest');
const testUserSongs = require('./user_songs.fixtures');
const testUsers = require('./users.fixtures');
const testSongs = require('./songs_endpoints.fixtures');
const jwt = require('jsonwebtoken');

describe.only('Practice History Endpoint', function(){
        let db
        before('make knex instance', () => {
            db = knex ({
                client: 'pg',
                connection: config.TEST_DATABASE_URL
            });
            app.set('db', db);
            //console.log('db', db)
        });
        after('disconnect from db', () => db.destroy());
        //error comes from here
        before('clean the table', () => db.raw('Truncate practice_history, user_songs, songs, users RESTART identity cascade'));
        //^^^^^^^^^
        //console.log(config.TEST_DATABASE_URL)
        //context('Given users have logged hours into the database', () => {
        beforeEach('insert test users', () => {
            return db.into('users').insert(testUsers);
        })
        beforeEach('insert test songs', () => {
            return db.into('songs').insert(testSongs);
        })
        beforeEach('insert test user_songs', () => {
            return db.into('user_songs').insert(testUserSongs);
        })
        beforeEach('insert test practice history', () => {
            return db.into('practice_history').insert(testPracticeHistory)
        });
        afterEach('truncate tables', () => db.raw('Truncate practice_history, user_songs, songs, users RESTART identity cascade'));

        function makeAuthHeader(user, secret = process.env.JWT_SECRET){
            const token = jwt.sign({id: user.id}, secret, {
                subject: user.username,
                algorithm: 'HS256'
            })
            return `Bearer ${token}`
        }

    describe('GET /practice-history', () => {
        it('GET /practice-history responds with 200 and all history that has been logged', () => {
            return supertest(app)
            .get('/api/practice-history')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(200);
        });
    });
    describe('POST /practice-history', () => {
        it(`responds with 400 if a song isnt in the req body`, () => {
            let noSong = {
                practice_date: '01-01-1970',
                practice_hours: 1
            };
            return supertest(app)
            .post('/api/practice-history')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(noSong)
            .expect(400);
        });
        it(`responds with 400 if no hours in the req body`, () => {
            let noStart = {
                song_practiced: 1
            };
            return supertest(app)
            .post('/api/practice-history')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(noStart)
            .expect(400);
        })
        it(`posts successfully should all the parameters be there`, () => {
            let validPost = {
                song_practiced: 1,
                practice_date: '01-01-1970',
                practice_hours: 1
            }
            return supertest(app)
            .post('/api/practice-history')
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(validPost)
            .expect(res => {
                expect(res.body.song_practiced).to.eql(validPost.song_practiced);
                expect(Date(res.body.start_time)).to.eql(Date(validPost.start_time));
                expect(Date(res.body.end_time)).to.eql(Date(validPost.end_time));
                expect(res.body).to.have.property('id')
            })
        })
    });
    describe('/GET practice sesson by id', () => {
        it('404 if the sesson is not found', () => {
            let fakeSesson = 12345;
            return supertest(app)
            .get(`/api/practice-history/${fakeSesson}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(404);
        });
        it('returns the session if found', () => {
            let sessionId = 1;
            return supertest(app)
            .get(`/api/practice-history/${sessionId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(res => {
                expect(201);
                expect(res.body.id).to.eql(sessionId);
            });
        });
    });
    describe('/DELETE practice session by id', () => {
        it('returns a 404 if the id is not found', () => {
            let fakeId = 12345;
            return supertest(app)
            .delete(`/api/practice-history/${fakeId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(404);
        });
        it('returns a 204 and confirmation of successfully deletion', () => {
            let validId = 1;
            return supertest(app)
            .delete(`/api/practice-history/${validId}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .expect(res => {
                expect(204);
                expect(res.body).to.eql('practice history successfully!')
            });
        });
    })
    describe('/PATCH practice session by id', () => {
        it('returns 400 if a song is not included', () => {
            let missingSong = {
                id: 1,
                practice_date: '01-01-1970',
                practice_hours: 2
            };
            return supertest(app)
            .patch(`/api/practice-history/${missingSong.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingSong)
            .expect(res => {
                expect(400);
                expect(res.body).to.eql('Please include a song to update');
            });
        });
        it('returns 400 if a date is not included', () => {
            let missingStart = {
                id: 1,
                song_practiced: 1,
                practice_hours: 1
            };
            return supertest(app)
            .patch(`/api/practice-history/${missingStart.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingStart)
            .expect(res => {
                expect(400);
                expect(res.body).to.eql('Please include a date to update');
            });
        });
        it('returns 400 if hours is not included', () => {
            let missingEnd = {
                id: 1,
                song_practiced: 1,
                practice_date: '01-01-1970'
            };
            return supertest(app)
            .patch(`/api/practice-history/${missingEnd.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(missingEnd)
            .expect(res => {
                expect(400);
                console.log(res)
                expect(res.body).to.eql('Please include hours to update');
            });
        });
        it('returns 204 and a confirmation of a successful update', () => {
            let validUpdate = {
                id: 1,
                song_practiced: 1,
                practice_date: '01-01-1970',
                practice_hours: 2
            }
            return supertest(app)
            .patch(`/api/practice-history/${validUpdate.id}`)
            .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(validUpdate)
            .expect(res => {
                expect(204)
                expect(res.body).to.eql('practice history updated successfully!');
            });
        })
    });
});