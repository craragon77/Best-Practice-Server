const UserSongs = {
    getAllUserSongs(knex){
        return knex.select().from('user_songs');
    }
}

module.exports = UserSongs