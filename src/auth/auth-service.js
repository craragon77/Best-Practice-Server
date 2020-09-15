const bcrypt = require('bcryptjs');

const AuthService = {
    getUserWithUserName(db, username){
        return db('users')
        .where({user_name})
        .first();
    },
    comparePasswords(password, hash){
        return bcrypt.compare(password, hash);
    },
    parseBasicToken(token){
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':');
    },
}