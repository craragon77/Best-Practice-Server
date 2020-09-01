const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe('Practice History Endpoint', function(){
    describe('Setting up the tests', function(){
        let db

        before('make knex instance', () => {
            db = knex ({
                client: 'pg',
                connection: process.env.TEST_DATABASE_URL
            });
            app.set('db', db);
        });
        after('disconnect from db', () => db.destroy());
        before('clean the table', () => db('pratice_history'));

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
});