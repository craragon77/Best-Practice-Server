const bcrypt = require('bcryptjs');
const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next){
    const authToken = req.get('Authorization') || ''

    let basicToken
    //thx for catching this Silveri!
    if(!authToken.toLowerCase().startsWith('basic ')){
        return res.status(401).json({
            error: 'Missing basic token'
        })
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length - 1);
    };
    const [tokenUserName, tokenPassword] = Buffer
        .from(basicToken, 'base64')
        .toString()
        .split(':');

    if(!tokenUserName || !tokenPassword){
        return res.status(401).json({
            error: 'Unauthorized request; Please include a valid username and password'
        });
    };
    req.app.get('db')('users')
        .where({username: tokenUserName})
        .first()
        .then(user => {
            if(!user){
                return res.status(401).json({
                    error: 'Unauthorized request; User not found'
                });
            }
            //why doesn't this want to work with me :(
            return AuthService.comparePasswords(tokenPassword, user.password)
                .then(passwordsMatch => {
                    if(tokenPassword !== user.password){
                        console.log('the password match here = ' + passwordsMatch)
                        return res.status(401).json({
                            error: 'Unauthorized request; Invalid Password'
                        })
                    }
                    console.log('the password match here = ' + passwordsMatch)
                    req.user = user
                    next()
                })
            })
        .catch(next);
}

module.exports = {
    requireAuth
}