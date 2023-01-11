const jwt = require("jsonwebtoken");
const Register = require("../modules/signup");

const auth = async(req,res,next)=>{
    try {
        //In 'token', the value stored in localstorage will come and it will be passed in SignLogin.js' /signup and /login route
        const token = req.headers["authorization"];

        //This will verify the localstorage token with original secret_key
        const verifytoken = jwt.verify(token,"iamviharmuneshchandraprajapatiiamvihar");
        
        //If it finds user's token in database then it will go furthur
        const user =await Register.findOne({_id: verifytoken._id,"tokens.token":token})

        if(!user)
        {
            throw new Error("User not found");
        }

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(402).json({msg: error.message});
    }
}

module.exports = auth;