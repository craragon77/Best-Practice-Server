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
    describe('POST /user-songs', () => {
        it(`sends a 400 and an error if there is no user_id`, () => {
            const noUserId = {
                song_id: 1,
                difficulty: 'hard',
                instrument: 'guitar',
                desired_hours: 1
            };
            return supertest(app)
            .post('/api/user-songs')
            .send(noUserId)
            .expect(400);
        });
        it(`sends a 400 and an error if there is no user_id`, () => {
            const noSongId = {
                user_id: 1,
                difficulty: 'hard',
                instrument: 'guitar',
                desired_hours: 1
            };
            return supertest(app)
            .post('/api/user-songs')
            .send(noSongId)
            .expect(400);
        });
        it(`sends a 400 and an error if there is no user_id`, () => {
            const noDifficulty = {
                song_id: 1,
                user_id: 1,
                instrument: 'guitar',
                desired_hours: 1
            };
            return supertest(app)
            .post('/api/user-songs')
            .send(noDifficulty)
            .expect(400);
        });
        it(`sends a 400 and an error if there is no user_id`, () => {
            const noInstrument = {
                song_id: 1,
                user_id: 1,
                difficulty: 'hard',
                desired_hours: 1
            };
            return supertest(app)
            .post('/api/user-songs')
            .send(noInstrument)
            .expect(400);
        });
        it(`sends a 400 and an error if there is no user_id`, () => {
            const noHours = {
                song_id: 1,
                user_id: 1,
                difficulty: 'hard',
                instrument: 'guitar',
            };
            return supertest(app)
            .post('/api/user-songs')
            .send(noHours)
            .expect(400);
        });
        it('posts a valid user piece if all the requirements are met', () => {
            const validUserSong = {
                //doesn't work when the id is 1 but DOES work when the id is 13?
                song_id: 13,
                user_id: 1,
                difficulty: 'hard',
                instrument: 'guitar',
                desired_hours: 1,
                comments: 'comment'
            };
            return supertest(app)
            .post('/api/user-songs')
            .send(validUserSong)
            .expect(res => {
                expect(res.body.song_id).to.eql(validUserSong.song_id);
                expect(res.body.user_id).to.eql(validUserSong.user_id);
                expect(res.body.difficulty).to.eql(validUserSong.difficulty);
                expect(res.body.instrument).to.eql(validUserSong.instrument);
                expect(res.body.desired_hours).to.eql(validUserSong.desired_hours);
                expect(res.body.comments).to.eql(validUserSong.comments);
                expect(res.body).to.have.property('id');
            })
        })
    })
})