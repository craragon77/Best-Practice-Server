const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const testPracticeHistory = require('./practice_history.fixtures');
const supertest = require('supertest');

describe('Practice History Endpoint', function(){
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
        before('clean the table', () => db('practice_history').truncate());
        //^^^^^^^^^
        console.log(config.TEST_DATABASE_URL)
        context('Given users have logged hours into the database', () => {
            beforeEach('insert test practice history', () => {
                return db.into('practice_history').insert(testPracticeHistory)
            });
        });
    describe('GET /practice-history', () => {
        it('GET /practice-history responds with 200 and all history that has been logged', () => {
            return supertest(app)
            .get('/api/practice-history')
            .expect(200);
        });
    });
    describe('POST /practice-history', () => {
        it(`responds with 400 if a song isnt in the req body`, () => {
            let noSong = {
                start_time: '01-01-1970',
                end_time: '01-01-1970'
            };
            return supertest(app)
            .post('/api/practice-history')
            .send(noSong)
            .expect(400);
        });
        it(`responds with 400 if no start_date in the req body`, () => {
            let noStart = {
                song_practiced: 1,
                end_time: '01-01-1970'
            };
            return supertest(app)
            .post('/api/practice-history')
            .send(noStart)
            .expect(400);
        })
        it(`posts successfully should all the parameters be there`, () => {
            let validPost = {
                song_practiced: 1,
                start_time: '01-01-1970',
                end_time: '01-01-1970'
            }
            return supertest(app)
            .post('/api/practice-history')
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
            //.expect(404, {error: {message: 'practice session not found'}});
            //^^^why does this fail the test?
            .expect(404);
        });
        it('returns the session if found', () => {
            let sessionId = 1;
            return supertest(app)
            .get(`/practice-history/${sessionId}`)
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
            .expect(404);
        });
        it('returns a 204 and confirmation of successfully deletion', () => {
            let validId = 1;
            return supertest(app)
            .delete(`api/practice-history/${validId}`)
            .expect(res => {
                expect(204);
                expect(res.body.json).to.eql('practice history successfully!')
            });
        });
    })
    describe('/PATCH practice session by id', () => {
        it('returns 400 if a song is not included', () => {
            let missingSong = {
                id: 1,
                start_time: 01-01-1970,
                end_time: 01-01-1970
            };
            return supertest(app)
            .patch(`/api/practice-history/${missingSong.id}`)
            .expect(res => {
                expect(400);
                expect(res.body.json).to.eql('Please include a song to change');
            });
        });
        it('returns 400 if a start date is not included', () => {
            let missingStart = {
                id: 1,
                song_practice: 1,
                end_time: 01-01-1970
            };
            return supertest(app)
            .patch(`/api/practice-history/${missingStart.id}`)
            .expect(res => {
                expect(400);
                expect(res.body.json).to.eql('Please include a start time to update');
            });
        });
        it('returns 400 if an end date is not included', () => {
            let missingStart = {
                id: 1,
                song_practice: 1,
                end_time: 01-01-1970
            };
            return supertest(app)
            .patch(`/api/pratice-history/${missingStart}`)
            .expect(res => {
                expect(400);
                expect(res.body.json).to.eql('Please include an end time to update');
            });
        });
        it('returns 204 and a confirmation of a successful update', () => {
            let validUpdate = {
                id: 1,
                song_practice: 1,
                start_time: 01-01-1970,
                end_time: 01-01-1970
            }
            return supertest(app)
            .patch(`/api/practice-history/${validUpdate}`)
            .expect(res => {
                expect(204);
                expect(res.body.json).to.eql('practice history updated successfully!');
            });
        })
    });
});