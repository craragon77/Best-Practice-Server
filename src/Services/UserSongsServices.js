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
    }
}

module.exports = UserSongs