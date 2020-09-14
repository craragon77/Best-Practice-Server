function requireAuth(req, res, next){
    const authToken = req.get('Authorization') || ''

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
            if(!user || user.password !== tokenPassword){
                return res.status(401).json({
                    error: 'Unauthorized request; User not found'
                });
            }
            next()
        })
        .catch(next);
}

module.exports = {
    requireAuth
}