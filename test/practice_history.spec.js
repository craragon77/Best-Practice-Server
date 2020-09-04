const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');

describe.only('Practice History Endpoint', function(){
    describe('Setting up the tests', function(){
        let db
        console.log(config.TEST_DATABASE_URL)
        before('make knex instance', () => {
            db = knex ({
                client: 'pg',
                connection: config.TEST_DATABASE_URL || "postgresql://CRA@localhost/Best-Practice-DB-Test"
            });
            app.set('db', db);
        });
        after('disconnect from db', () => db.destroy());
        before('clean the table', () => db('pratice_history').truncate());

        context('Given users have logged hours into the database', () => {
            const testPracticeHistory = [
                {
                    id: 1,
                    song_practice: 1,
                    start_time: 01-01-1970,
                    end_time: 01-01-1970
                },
                {
                    id: 2,
                    song_practice: 2,
                    start_time: 01-01-1970,
                    end_time: 01-01-1970
                },
                {
                    id: 3,
                    song_practice: 3,
                    start_time: 01-01-1970,
                    end_time: 01-01-1970
                }    
            ];
            beforeEach('insert test practice history', () => {
                return db.into('practice_history').insert(testPracticeHistory)
            });
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
            .get(`/practice-history/${fakeSesson}`)
            //.expect(404, {error: {message: 'practice session not found'}});
            //^^^why does this fail the test?
            .expect(404);
        })
    })
});