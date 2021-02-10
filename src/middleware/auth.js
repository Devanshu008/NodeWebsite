const { error } = require("jquery");
const jwt = require("jsonwebtoken");
const Register = require("../models/login");

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        next();
        const user = await Register.findOne({ _id: verifyUser._id });
        req.token = token;
        req.user = user;
    } catch (error) {
        res.status(401).send(error)
    }
}
module.exports = auth;