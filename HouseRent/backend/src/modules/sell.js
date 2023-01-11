const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const sell =new mongoose.Schema({
    types:{
        type: String,
        
       },
      bedrooms:{
        type: String,  
       
    },
      bathrooms:{
        type: String,
       
    },
      furnishing:{
        type: String,   
       
    },
      listedby:{
        type: String,  
       
    },
      builtup:{
        type: Number,    
       
    },
      carpet:{
        type: Number,    
       
    },
      bachelors:{
        type: String,    
       
    },
      maintanence:{
        type: Number,    
       
    },
      floors:{
        type: Number,    
       
    },
       floorno:{
        type: String,    
       
    },
      car:{
        type: String,    
       
    },
      title:{
        type: String,    
       
    },
      desc:{
        type: String,    
       
    },
      city:{
        type:String,
        
      },
      price:{
        type: Number,
        
      },
      phone:{
        type: Number,
        
      }
})

const SellHouse = new mongoose.model("SellHouse",sell);
module.exports = SellHouse;