const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    let token_bearer;
    const bearer = req.headers['authorization'];
    if (typeof bearer !== 'undefined') {
        token_bearer = bearer.split(' ')[1];
    }
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || token_bearer;

    if (!token) {
        return res.status(403).send("Token dibutuhkan untuk authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Token Tidak Sesuai");
    }
    return next();
};

module.exports = verifyToken;