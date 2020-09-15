const knex = require('knex');
const app = require('../src/app');
const supertest = require('supertest');
const testUsers = require('./users.fixtures');


describe.only('Auth Endpoints', function(){
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
    before(`clean the table`, () => db.raw(`Truncate practice_history, user_songs, users, songs RESTART identity cascade`))
    
    
    beforeEach('insert test user pieces', () => {
        return db.into('users').insert(testUsers)
    });
    beforeEach('insert test user pieces', () => {
        console.log('echo 3')
        //doesn't insert because of foreign key constraints
        return db.into('songs').insert(testSongs)
    });
    beforeEach('insert test user pieces', () => {
        console.log('echo 1')
        //doesn't insert because of foreign key constraints
        return db.into('user_songs').insert(testUserPieces)
    });
    //});
    //after('truncate all tables', () => db('users').truncate());
    //after('truncate all tables', () => db('songs').truncate());
    console.log('the db is: ' + db)
    //afterEach('truncate all tables', () => db('practice_history','user_songs', 'songs', 'users').truncate());
    afterEach('truncate all tables', () => db.raw(`Truncate practice_history, user_songs, users, songs RESTART identity cascade`));

    function makeAuthHeader(user){
        const token = Buffer.from(`${user.username}:${user.password}`).toString('base64')
        return `basic ${token}`
    }

})