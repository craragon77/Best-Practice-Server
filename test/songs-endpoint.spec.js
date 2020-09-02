const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe('Songs Endpoint', function(){
    describe('Setting up tests', function(){
        let db

        before('make knex instance', () => {
            db = knex({
                client: 'pg',
                connection: process.env.TEST_DATABASE_URL
            });
            app.set('db', db);
        });
        after('disconnect from db', () => db.destroy());
        //computer gets mad when I have a table here
        before('clean the table', () => db('songs').truncate());


        context('Given there are users in the database', () => {
            const testSongs = [
                {
                    id: 1,
                    title: 'Great Gig in the Sky',
                    composer: 'Pink Floyd'
                },
                {
                    id: 2,
                    title: 'Money',
                    composer: 'Pink Floyd'
                },
                {
                    id: 3, 
                    title: 'Eclipse',
                    composer: 'Pink Floyd'
                }
            ];
            beforeEach('insert test songs', () => {
                return db.into('songs').insert(testSongs)
            });
        });
    });
    describe('GET /songs', () => {
        it('GET /songs responds with 200 and all of the songs', () => {
            return supertest(app)
            .get('/api/songs')
            .expect(200)
        });
    });
});