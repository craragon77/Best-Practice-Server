const SongsService = {
    getAllSongs(knex){
        return knex.select().from('songs');
    },
    
}

module.exports = SongsService;