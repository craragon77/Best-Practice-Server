const UserService = {
    getAllUsers(knex){
        return knex.select().from('users')
    }
}

module.exports = UserService;