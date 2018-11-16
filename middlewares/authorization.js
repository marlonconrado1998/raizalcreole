var jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (error, resp) => {
            if (resp) {
                next();
            } else if (error) {
                res.status(401).send("Unauthorized");
            }
        });
    } else {
        res.status(401).send("Unauthorized");
    }
}



module.exports = 
{
    verifyToken
}