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
        });
    },
    getUserById(knex, id){
        return knex.select().from('users').where('id', id).first();
    }
}

module.exports = UserService;