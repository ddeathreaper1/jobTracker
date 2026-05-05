// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // console.log(token)

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err.message)
            return res.sendStatus(403);
        }
        // console.log("Decoded:-",user)
        req.user = user;
        next();
    });
};

module.exports = authenticate;