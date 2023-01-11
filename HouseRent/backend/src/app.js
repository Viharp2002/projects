const express = require("express");
const app = express();
const cors = require("cors");
const Register = require("./modules/signup");
const auth = require("./middlewares/auth");
const SellYour = require("./modules/sell");
const bcrypt = require("bcryptjs");
require("./conn/conn");

app.use(cors());


const path = require("path");
const port = process.env.PORT || 3500;

// Public Static Path
const pathPublic = path.join(__dirname, "../public");
app.use(express.static(pathPublic));
var bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: false })); // to support URL-encoded bodies


app.get('/', (req, res) => {
    res.render("index");
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/signup", (req, res) => {
    res.render("signup");
})

//Show user Profile
app.get('/profile',auth,async(req,res)=>{
    try {
        //It will send the whole user to frontend
        res.status(201).json({msg: req.user});
    } catch (error) {
        console.log(error);
        res.status(422).json({msg: error.message});
    }
})

app.post("/changepass",auth,async(req,res)=>{
    try {
        const password = req.body.password;
        const npassword = req.body.npassword;
        const ncpassword = req.body.ncpassword;

        if(!password || !npassword || !ncpassword)
        {
            throw new Error("Fill please");
        }
        if(npassword!==ncpassword)
        {
            throw new Error("Please make both passwords same");
        }
        const userAvail = req.user;
        const compare = await bcrypt.compare(password,userAvail.password);
        
        if(!compare)
        {
           throw new Error("old password is not matched");
        }

      const  bnpassword = await bcrypt.hash(npassword,10);
        const bncpassword = await bcrypt.hash(ncpassword,10);

        const updatePassword = await Register.updateOne({_id: userAvail._id},{$set:{password:bnpassword}})
        const updateCpassword = await Register.updateOne({_id: userAvail._id},{$set:{cpassword:bncpassword}})
        


        res.json({msg:'success'});
    } catch (error) {
        console.log(error);
        res.status(422).json({msg: error.message});
    }
})

app.post("/changeusername",auth,async(req,res)=>{
    try {
         const username = req.body.username;

        if(!username)
        {
            throw new Error("Fill please");
        }

        // const usernamee = JSON.stringify(username);
    
        const userAvail = req.user;
    
        const updatePassword = await Register.updateOne({_id: userAvail._id},{$set:{username:username}}); 
        
        
        res.json({msg:'success'});
    } catch (error) {
        console.log(error);
        res.status(422).json({msg: error.message});
    }
})

app.post("/changeemail",auth,async(req,res)=>{
    try {
         const email = req.body.email;

        if(!email)
        {
            throw new Error("Fill please");
        }
    
        const userAvail = req.user;
    
        const updatePassword = await Register.updateOne({_id: userAvail._id},{$set:{email:email}}); 
        
        
        res.json({msg:'success'});
    } catch (error) {
        console.log(error);
        res.status(422).json({msg: error.message});
    }
})

//For favourites
// app.post("/fav/:id",auth,async(req,res)=>{
    
// })

//Particuler house ni details jova mate no route...je ena url ma id lai ne avyo che
app.get("/sell/:id",async(req,res)=>{

    //url na parameter mathi id lai lidhi
    let _id = req.params.id;
    
    //e id ni badhi details find kari 'findOne' thi
     let vih = await SellYour.findOne({_id});
     res.json(vih);
})

app.get("/houses",async(req,res)=>{
   let vih = await SellYour.find().select('types bedrooms listedby builtup city price');
   res.json(vih);
})

app.post("/sell",auth,async(req,res)=>{
    try {
        const types =  req.body.types;
        const bedrooms = req.body.bedrooms;
        const bathrooms =  req.body.bathrooms;
        const furnishing =  req.body.furnishing;
        const listedby = req.body.listedby;
        const builtup = req.body.builtup;
        const carpet = req.body.carpet;
        const bachelors = req.body.bachelors;
        const maintanence = req.body.maintanence;
        const floors = req.body.floors;
        const floorno = req.body.floorno;
        const car = req.body.car;
        const title = req.body.title;
        const desc = req.body.desc;
        const price = req.body.price;
        const phone = req.body.phone;
        const city = req.body.city;
        
        if(!types || !bedrooms || !bathrooms || !furnishing || !listedby || !maintanence || !builtup || !carpet || !bachelors || !floors || !floorno || !car || !title|| !desc || !price || !city || !phone)
        {
            throw new Error("Fill all");   
        } 
            const sell = new SellYour({
                  types: req.body.types,
                  bedrooms: req.body.bedrooms,
                  bathrooms: req.body.bathrooms,
                  furnishing: req.body.furnishing,
                  listedby:req.body.listedby,
                  builtup:req.body.builtup,
                  carpet:req.body.carpet,
                  bachelors:req.body.bachelors,
                  maintanence:req.body.maintanence,
                  floors:req.body.floors,
                  floorno:req.body.floorno,
                  car:req.body.car,
                  title:req.body.title,
                  desc:req.body.desc,
                  city:req.body.city,
                  price: req.body.price,
                  phone: req.body.phone
                //   img1:{
                //       data:req.file.img1,
                //       contentType: "image/png"
                //   }
             })
        //   }

        //})
   
       const ress = await sell.save();
       res.json({msg:"successsss"});
    } catch (error) {
        res.status(422).json({msg: error.msg});
        console.log(error)
   }
})

app.post("/signup",async(req,res)=>{
   const {username,email,password,cpassword} = req.body;
   
   
   try {

       if(!username || !email || !password || !cpassword)
       {
        throw new Error("Fill all");
       }
    
       const usermail = await Register.findOne({ email:email});
    
       if(usermail)
       {
        throw new Error("Email is there");
       }
       else if(password!==cpassword)
       {
          throw new Error("passwords are not matched");
       }

       const regiForm = new Register({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword
    })

    //This will generates a new auth token for the user
    const token = await regiForm.generateAuthToken();
    
    const ress = await regiForm.save();


    // The token will be passed to frontend and it describes that user signin successfully and also in frontend it will set the localstorage's 'sanket' value
    res.json({success:true,msg:token});
   }
   catch(error)
   {
     res.status(422).json({success:false,msg:error.message});
    console.log(error);
   }
})

app.get("/login", (req, res) => {
    res.render("signup");
})

app.post("/login", async(req, res) => {
    const {username,password} = req.body;
    const useravail = await Register.findOne({ username:username });
    
    try {
        if(!username || !password)
        {
             throw new Error("Fill all");
        }
        if(useravail)
        {
            const compare = await bcrypt.compare(password,useravail.password);
            if(compare)
            {
                //token generate karavyu secret key through
               const token = await useravail.generateAuthToken();

            //    ene frontend ma mokli didhu localstorage ma store karava
               res.status(201).json({msg:token});
            }
            else{
                 throw new Error("Invalid Creditianls");
            }    
        }
        else
        {
            throw new Error("Invalid Creditianls");
        }
    }
    catch(error){
        res.status(422).json({msg:error.message});
        console.log(error);
    }
})

app.get("/logout",auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token != req.token;
           })
    
           res.clearCookie("jwt");
           await req.user.save();
           res.render("signup");

    } catch (error) {
        res.status(401).send(error)
    }
})


app.listen(port, () => {
    console.log("Done");
})