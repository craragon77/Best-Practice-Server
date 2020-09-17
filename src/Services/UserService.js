const bcrypt = require('bcryptjs')

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
    },
    deleteUsers(knex, id){
        return knex('users')
        .where({id})
        .delete();
    },
    updateUsers(knex, id, newUserFields){
        return knex('users')
        .where({id})
        .update(newUserFields);
    },
    hasUserWithUserName(db, username){
        return db('users')
        .where({username})
        .first()
        .then(user => !!user)
    },
    hashPassword(password){
        return bcrypt.hash(password, 10)
    }
}

module.exports = UserService;