let jwtSecret = 'your_jwt_secret';
let jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport');

function generateJWTToken(user) {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

module.exports = (router) => {
    console.log('ROUTEREEE')
    router.post('/login', (req, res) => {
        console.log('USERNAME!!!! : ')
        console.log(req.Username)
        passport.authenticate('local', { session : false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something\'s not right',
                    user: user
                });
            }
            req.login(user, { session : false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}