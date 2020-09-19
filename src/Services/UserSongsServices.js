const UserSongs = {
    getAllUserSongs(knex){
        return knex.select().from('user_songs');
    },
    postUserSongs(knex, newPracticeHistory){
        return knex
        .insert(newPracticeHistory)
        .into('user_songs')
        .returning('*')
        .then(rows => {
            return rows[0]
        });
    },
    getUserSongById(knex, id){
        return knex.select().from('user_songs').where('id', id).first();
    },
    deleteUserSongs(knex, id){
        return knex('user_songs')
        .where({id})
        .delete();
    },
    updateUserSongs(knex, id, newUserSongFields){
        return knex('user_songs')
        .where({id})
        .update(newUserSongFields);
    },
    getAllUserSongsByUserId(knex, user_id){
        //gonna need to throw a join or something in this bitch lolol
        return knex.select()
        .from('user_songs AS us')
        .join('songs AS s', 's.id', 'us.song_id')
        .where('user_id', user_id)
    },
    getAllUserSongInfoForAUser(knex, user_id){
        //lolol finish this query later lolol
        return knex('user_songs')
        .select()
        .from('user_songs AS us')
        .leftJoin('songs AS s', 's.id', 'us.song_id')
        .leftJoin('practice_history AS p', 'us.id', 'p.song_practiced')
        .where('user_id', user_id)
    }
}

module.exports = UserSongs