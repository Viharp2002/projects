const userModel = require("../model/user")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require("password-validator");
const schema = new passwordValidator();

const Login = async (req, res) => {
    let { mail, password } = req.body;

    // validate mail & password

    try {
        let result = await userModel.findOne({ mail: mail });
        if (!result) {
            throw new Error("Email not found");
        }

        let pass = await bcrypt.compare(password, result.password);
        if (!pass) {
            throw new Error("Incorrect credentials");
        }

        const encode = jwt.sign(result._id.valueOf(), process.env.JWT_SECRET);

        res.json({ success: true, msg: encode });

    } catch (e) {
        res.status(422).json({ success: false, msg: e.message })
    }

}

const Register = async (req, res) => {
    let { name, mail, password, cpassword } = req.body;
    try {

        schema
            .is().min(7)                                    // Minimum length 8
            .is().max(100)                                  // Maximum length 100
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()                              // Must have lowercase letters
            .has().digits(1)                                // Must have at least 2 digits
        if (!schema.validate(password)) {
            throw new Error("password sarkho nakh");
        }

        let result = await userModel.findOne({ mail: mail });
        if (result) throw new Error("Email already registerd");

        if (password !== cpassword) {
            throw new Error("Passwords are not matching!!");
        }

        let salt = await bcrypt.genSalt();
        let hash = await bcrypt.hash(password, salt);

        let newUser = new userModel({
            ...req.body,
            password: hash,
            isAdmin: false
        });

        let resu = await newUser.save();
        const encode = jwt.sign(resu._id.valueOf(), process.env.JWT_SECRET);

        res.json({ success: true, msg: encode });

    } catch (e) {
        res.status(422).json({ success: false, msg: e.message });
    }

}
let Info = async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.user }).select({ password: 0 });
        if (!user) throw new Error("no user found");
        res.json({ success: true, msg: user })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const post_extra_info = async (req, res) => {
    try {
        let user = await userModel.findOneAndUpdate({ _id: req.user }, {
            information: req.body.data
        }, {
            new: true
        })
        res.json({ success: true, msg: user })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

// history to display users total applied schem

let allUser = async (req, res) => {
    try {
        let users = await userModel.find();
        res.json({ success: true, msg: users })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const oneUser = async (req, res) => {
    try {
        let { id } = req.params;
        let users = await userModel.findOne({ _id: id }).populate({
            path: "schems.schem",
            select: "name image desc"
        }).populate({
            path: "information.formfield",
            select: "name"
        });
        res.json({ success: true, msg: users })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const updateUser = async (req, res) => {
    try {
        let users = await userModel.findOneAndUpdate({ _id: req.user }, {
            ...req.body
        }, { new: true });
        res.json({ success: true, msg: users })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

module.exports = { Login, Register, Info, allUser, post_extra_info, oneUser, updateUser }