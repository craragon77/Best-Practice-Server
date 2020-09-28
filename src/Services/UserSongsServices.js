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
        //this one gets all the songs associated with a user
        return knex.select()
        .from('user_songs AS us')
        .join('songs AS s', 's.id', 'us.song_id')
        .where('user_id', user_id)
    },
    getAllUserSongHistoryForAUser(knex, user_id){
        //this one gets all songs associated with a user + the practice history
        return knex('user_songs')
        .select()
        .from('user_songs AS us')
        .leftJoin('songs AS s', 's.id', 'us.song_id')
        .leftJoin('practice_history AS p', 'us.id', 'p.song_practiced')
        .where('user_id', user_id)
    },
    getOnlyPracticeHistory(knex, song_id, user_id){
        return knex('user_songs')
        .select()
        .from('user_songs AS us')
        .leftJoin('practice_history AS p', 'p.song_practiced', 'us.id')
        .where('song_id', song_id)
        .andWhere('user_id', user_id)
    },
    getUserSongBySongId(knex, song_id, user_id){
        return knex('user_songs')
        .select()
        .from('user_songs AS us')
        .where('us.song_id',song_id)
        .andWhere('us.user_id', user_id)
    },
    getSongsToLogHours(knex, user_id){
        //returns all songs associated with a user but formatted for post history queries
        return knex('user_songs')
        .select(
            'us.id',
            'us.user_id',
            'us.song_id',
            's.title',
            's.composer'
        )
        .from('user_songs AS us')
        .leftJoin('songs AS s', 's.id', 'us.song_id')
        .where('user_id', user_id)
    },
    simpleGetUserSongsConfirmation(knex, user_id){
        return knex.select('song_id', 'user_id').from('user_songs').where('user_id', user_id)
    }

}

module.exports = UserSongs