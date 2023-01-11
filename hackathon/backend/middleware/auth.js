const jwt = require('jsonwebtoken');
const userModel = require("../model/user");

const authenticate = async (req, res, next) => {

    let token = req.headers['authorization'];
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await userModel.findOne({ _id: decoded });
        if (user) {
            req.user = decoded;
            next();
        } else {
            throw new Error("plz login")
        }

    } catch (e) {
        res.json({ success: false, msg: e.message, Remove_auth: true })
    }
}

module.exports = authenticate;