const SongsService = {
    getAllSongs(knex){
        return knex.select().from('songs');
    },
    postNewSong(knex, newSong){
        return knex
        .insert(newSong)
        .into('songs')
        .returning('*')
        .then(rows => {
            return rows[0]
        });
    },
    getSongById(knex, id){
        return knex.select().from('songs').where('id', id).first();
    },
    deleteSongs(knex, id){
        return knex('songs')
        .where({id})
        .delete();
    },
    updateSongs(knex, id, newSongFields){
        return knex('songs')
        .where({id})
        .update(newSongFields);
    },
    getAllSongByUserId(knex, user_id){
        return knex.select().from('songs').where('user_id', user_id)
    },
    
}

module.exports = SongsService;