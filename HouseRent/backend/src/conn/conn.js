const mongoose = require("mongoose");

const db = "mongodb+srv://viharp2002:Admission20%40@cluster0.biinfqm.mongodb.net/houserent?retryWrites=true&w=majority";
mongoose.connect(db).then(() => {
    console.log("Connection");
}).catch((error) => {
    console.log(error);
});