const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const rentHome = new mongoose.Schema({
    username:{
      type: String,
      required: true
    },
    email:{
        type: String,
      required: true,
      unique: true
    },
    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

rentHome.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},"iamviharmuneshchandraprajapatiiamvihar");

        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send(`Error is ${e}`);
        console.log(error);
    }
}

rentHome.pre("save",async function(next){
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password,10);
        this.cpassword = await bcrypt.hash(this.cpassword,10);
        next();
    }
})

const Register = new mongoose.model("Register",rentHome);
module.exports = Register;