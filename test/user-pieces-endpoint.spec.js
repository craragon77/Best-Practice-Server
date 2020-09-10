const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const config = require('../src/config');
const testUserPieces = require('./user_songs.fixtures');
const supertest = require('supertest');
const testUsers = require('./users.fixtures');
const testSongs = require('./songs_endpoints.fixtures');

describe('User-Songs endpoint!', function(){
        let db
        before('make knex instance', () => {
            db = knex({
                client: 'pg',
                connection: config.TEST_DATABASE_URL
            });
            app.set('db', db)
        });
        ;
        console.log(testUserPieces)
        after('disconnect from db', () => db.destroy());
        //before('clean related table', () => db('users').truncate());
        //before('clean related table', () => db('songs').truncate());
        //before('clean the table', () => knex.raw('TRUNCATE user_songs, users, songs RESTART IDENTITY CASCADE'));;
        before('clean related table', () => db('practice_history','user_songs').truncate());
        //contents of context are not being called when they are within the context()
        context('Given there are pieces in the database', () => {
            beforeEach('insert test user pieces', () => {
                console.log('echo')
                //doesn't insert because of foreign key constraints
                return db.into('user_songs').insert(testUserPieces), console.log('user_songs truncated successfully')
                
            });
        });
        //after('truncate all tables', () => db('users').truncate());
        //after('truncate all tables', () => db('songs').truncate());
        console.log('the db is: ' + db)
        afterEach('truncate all tables', () => db('practice_history','user_songs').truncate());

    describe('GET /user-songs', () => {
        it('GET /user-pieces responds with 200 and all the pieces any user has logged', () => {
            return supertest(app)
            .get('/api/user-songs')
            .expect(200)
        });
    });
    describe.only('POST /user-songs', () => {
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
        });
    });
    describe('GET user_songs based on the id', () => {
        it(`returns 404 if the user_song id is not found`, () => {
            let user_songId = 12345;
            return supertest(app)
            .get(`/api/user-songs/${user_songId}`)
            .expect(404)
        })
        it('responds with 201 and the item in question', () => {
            let user_songId = 1;
            return supertest(app)
            .get(`/api/user-songs/${user_songId}`)
            .expect(res => {
                expect(201);
                expect(res.body.user_songId).to.eql(user_songId);
            })

        })
    });
    describe('DELETE user_songs based on the id', () => {
        it('returns 404 when a user_song is not found', () => {
            const user_songId = 12345;
            return supertest(app)
            .delete(`/api/user-songs/${user_songId}`)
            .expect(404);
        })
        it('deletes user_song when the entry item is found + returns 204', () => {
            const user_songId = 1;
            return supertest(app)
            .delete(`/api/user-songs/${user_songId}`)
            .expect(res => {
                expect(204);
                expect(res.body.json).to.eql('user_song successfully deleted');
            });
        })
    });
    describe('PATCH user_songs based on the id + updates information accordingly', () => {
        it('returns 400 if user_id is not included', () => {
            const missingUserId = {
                id: 1,
                song_id: 1,
                difficulty: 'hard as the dickens',
                instrument: 'guitar',
                desired_hours: 1,
                comments: 'comment',
                date_added: 01-01-1970
            };
            return supertest(app)
            .patch(`/api/user-songs/${missingUserId.id}`)
            .expect(res => {
                expect(400);
                expect(res.body.json).to.eql('please include a user_id to update')
            });
        });
        it('returns 400 if song_id is not included', () => {
            const missingUserId = {
                id: 1,
                user_id: 1,
                difficulty: 'update',
                instrument: 'update',
                desired_hours: 1,
                comments: 'update',
                date_added: 01-01-1970
            };
            return supertest(app)
            .patch(`/api/user-songs/${missingUserId.id}`)
            .expect(res => {
                expect(400);
                expect(res.body.json).to.eql('please include a song to update information');
            });
        });
        it('returns 400 if difficulty is not included', () => {
            const missingUserId = {
                id: 1,
                user_id: 1,
                song_id: 1,
                instrument: 'update',
                desired_hours: 1,
                comments: 'update',
                date_added: 01-01-1970
            };
            return supertest(app)
            .patch(`/api/user-songs/${missingUserId.id}`)
            .expect(res => {
                expect(400);
                expect(res.body.json).to.eql('please include a  to update information');
            });
        });
        it('returns 400 if difficulty is not included', () => {
            const missingUserId = {
                id: 1,
                user_id: 1,
                song_id: 1,
                difficulty: 'update',
                desired_hours: 1,
                comments: 'update',
                date_added: 01-01-1970
            };
            return supertest(app)
            .patch(`/api/user-songs/${missingUserId.id}`)
            .expect(res => {
                expect(400);
                expect(res.body.json).to.eql('please include an instrument  to update information');
            });
        });
        it('returns 400 if desired_hours is not included', () => {
            const missingUserId = {
                id: 1,
                user_id: 1,
                song_id: 1,
                difficulty: 'update',
                instrument: 'update',
                comments: 'update',
                date_added: 01-01-1970
            };
            return supertest(app)
            .patch(`/api/user-songs/${missingUserId.id}`)
            .expect(res => {
                expect(400);
                expect(res.body.json).to.eql('please include desired hours to update information');
            });
        });
        it('updates successfully', () => {
            const validUpdate = {
                id: 1,
                user_id: 1,
                song_id: 1,
                difficulty: 'update',
                instrument: 'update',
                desired_hours: 1,
                comments: 'update',
                date_added: 01-01-1970
            };
        return supertest(app)
        .patch(`/api/user-songs/${validUpdate.id}`)
        .expect(res => {
            expect(204);
            expect(res.body.json).to.eql('user_song updated successfully');
        }); 
    });
    });
})