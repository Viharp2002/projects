const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

require("dotenv").config();
require("./config/connectDb");

const userRoute = require("./route/user");
const schemRoute = require("./route/schem");
const schemApply = require("./route/applySchem");
const formF = require("./route/form")

const getImage = require("./helper/getimage");
const getDocs = require("./helper/getdocs");
const { uploadDocs } = require("./config/upload");
const uploadDoc = require("./helper/uploadDoc");

app.post("/docs/upload", uploadDocs.fields([
    { name: 'income', maxCount: 1 }, { name: "cast", maxCount: 1 }, { name: "adhar card", maxCount: 1 }, {
        name: "std 10 marksheet", maxCount: 1
    },
    { name: "std 12 marksheet", maxCount: 1 },
    { name: "fee receipt", maxCount: 1 },
    { name: "self declaration", maxCount: 1 },
    { name: "letter of hod", maxCount: 1 },
    { name: "hostel receipt", maxCount: 1 },
    { name: "passbook", maxCount: 1 },
    { name: "IT return", maxCount: 1 },
    { name: "photo", maxCount: 1 }
]), uploadDoc)

app.get("/docs/:name", getDocs);

app.get("/images/:name", getImage);

app.use("/", schemApply);

app.use("/user", userRoute);

app.use("/schem", schemRoute);

app.use("/form_field", formF);

app.listen(process.env.PORT, () => {
    console.log("server running on " + process.env.PORT);
})

// functinality of searching
// ask user to fillup one form after he/she has log in
// form contains some fields like category, age,income,college, girl/boy etc
// so by this we can recommand schems which are for those user

// sending notification from admin to all users or perticular user
// contact us, user apply, verify
// mail verify , forget password

// admin can see all users & their applied schems
// admin can see all schems & all users who has applied in that schem
// verified & non-verified user


