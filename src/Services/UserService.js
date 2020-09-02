const UserService = {
    getAllUsers(knex){
        return knex.select().from('users');
    },
    postNewUser(knex, newUser){
        return knex
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    }
}

module.exports = UserService;