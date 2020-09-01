const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe('User-Songs endpoint!', function(){
    describe('Setting up the tests', function(){
        let db

        before('make knex instance', () => {
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DATABASE_URL
            });
            app.set('db', db);
        });
        after('disconnect from db', () => db.destroy());
        before('clean the table', () => db('users').truncate());

        context('Given that users have logged pieces in the database', () => {
            const testUserPieces = [
                {
                    id: 1,
                    user_id: 1,
                    song_id: 1,
                    difficulty: 'easy',
                    instrument: 'guitar',
                    desired_hours: 1,
                    comments: 'comment',
                    date_added: 01-01-1970
                },
                {
                    id: 2,
                    user_id: 2,
                    sond_id: 2,
                    difficulty: 'easy',
                    instrument: 'guitar',
                    desired_hours: 1,
                    comments: 'comment',
                    date_added: 01-01-1970
                }
            ];
            beforeEach('insert test user pieces', () => {
                return db.into('user_songs').insert(testUserPieces)
            });
        });
    });
    describe('GET /user-songs', () => {
        it('GET /user-pieces responds with 200 and all the pieces any user has logged', () => {
            return supertest(app)
            .get('/api/user-songs')
            .expect(200)
        });
    });
})