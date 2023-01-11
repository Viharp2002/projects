const userModel = require("../model/user");

const isAdmin = async (req, res,next) => {

    try {
        let adminUser = await userModel.findOne({ _id: req.user });
        if(adminUser.isAdmin == true){
            next();
        }else{
            throw new Error("permission denied");
        }

    } catch (e) {
        res.json({ success: false, msg: e.message, Remove_auth: true })
    }
}

module.exports = isAdmin;
