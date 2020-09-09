const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const testSongs = require('./songs_endpoints.fixtures');
const supertest = require('supertest');
const { expectCt } = require('helmet');

describe('Songs Endpoint', function(){
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
        before('clean the table', () => knex(db('songs').truncate()));


        context('Given there are users in the database', () => {
            beforeEach('insert test songs', () => {
                return db.into('songs').insert(testSongs)
            });
        });
    describe('GET /songs', () => {
        it('GET /songs responds with 200 and all of the songs', () => {
            return supertest(app)
            .get('/api/songs')
            .expect(200)
        });
        it('responds with 404 if the song cannot be found', () => {
            let missingId = 12345;
            return supertest(app)
            .get(`/api/songs/${missingId}`)
            .expect(404);
        })
        it('responds with the song if the id is valid', () => {
            let validId = 1;
            return supertest(app)
            .get(`/api/songs/${validId}`)
            .expect(res => {
                expect(201)
                expect(res.body.id).to.eql(validId);
            });
        });
    });
    describe('POST /songs', () => {
        it('the POST lacks a title', () => {
            let missingTitle = {
                composer: 'The Beatles'
            };
            return supertest(app)
            .post(`/api/songs/`)
            .expect(res => {
                expect(400)
                expect(res.body.json).to.eql('all new songs must include the title of the piece');
            });
        });
        it('the POST lacks a composer', () => {
            let missingComposer = {
                title: 'I Want You'
            };
            return supertest(app)
            .post(`/api/songs`)
            .expect(res => {
                expect(400)
                expect(res.body.json).to.eql(`all new songs must include the composer`);
            });
        });
        it('the POST meets the requirements', () => {
            let validSong = {
                title: 'I Want You',
                composer: 'The Beatles'
            }
            return supertest(app)
            .post(`/api/songs`)
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
            .expect(res => {
                expect(404);
                expect(res.body.json).to.eql('song not found');
            });
        })
        it(`responds with 204 if the id can be found`, () => {
            let id = 1;
            return supertest(app)
            .delete(`/api/songs/${id}`)
            .expect(res => {
                expect(204);
                expect(res.body.json).to.eql(`song successfully deleted!`);
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
            .expect(res => {
                expect(400)
                expect(res.body.json).to.eql(`all new songs must include the composer`);
            });
        });
        it('the PATCH lacks a title', () => {
            let missingTitle = {
                id: 1,
                composer: 'The Beatles'
            };
            return supertest(app)
            .patch(`/api/songs/${missingTitle.id}`)
            .expect(res => {
                expect(400)
                expect(res.body.json).to.eql(`all new songs must include the composer`);
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
            .expect(res => {
                expect(204)
                expect(res.body.titel).to.eql(validPatch.title);
                expect(res.body.composer).to.eql(validPathc.composer);
            })
        })
    });
});