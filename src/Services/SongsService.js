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
    updateSnogs(knex, id, newSongFields){
        return knex('songs')
        .where({id})
        .update(newSongFields);
    }
    
}

module.exports = SongsService;