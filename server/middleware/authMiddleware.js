const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;


const isVerified = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                console.log("Invalid Token send!" + err)
                res.status(401).send({ "msg": "Invalid Token send!" });
            }
            else {
                req.user = decoded.user;
                next();
            }
        });
    }
    else {
        res.status(401).send({ "meg": "Please provide the token in header!" });
    }
};

module.exports = isVerified;