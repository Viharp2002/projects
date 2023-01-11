const schemModel = require("../model/schem");
const usermodel = require("../model/user");

// const getSchems = async (req, res) => {
//     try {

//         let schems = await schemModel.find().select("name image desc")
//         res.json({ success: true, msg: schems });
//     } catch (e) {
//         res.json({ success: false, msg: e.message });
//     }
// }

const getMyschema = async (req, res) => {
    try {
        let user = await usermodel.findOne({ _id: req.user });
        console.log(user)
        let obj = {}
        if (user.income) {
            let income = user.income;
            obj = {
                ...obj,
                Income: { $gt: income }
            }
        }
        if (user.age) {
            let age = Number(user.age)
            obj = {
                ...obj, maxAge: { $gt: age }, minAge: { $lt: age }
            }
        }
        if (user.gender) {
            obj["gender"] = user.gender
        }
        if (user.cast) {
            obj["cast"] = user.cast
        }
        // console.log(obj);

        let schems = await schemModel.find(obj).select("name image");
        res.json({ success: true, msg: schems });

    } catch (e) {
        res.json({ success: false, msg: e.message });
    }
}

const getSchems = async (req, res) => {
    try {
        let pageNo = req.query.page;

        let name = new RegExp(req.query.s ? req.query.s : "", "i");

        let obj = {};

        if (req.query.domain) {
            obj["Domain"] = req.query.domain
        }
        if (req.query.income) {
            let income = req.query.income;
            obj = {
                ...obj,
                Income: { $gt: income }
            }
        }
        if (req.query.age) {
            let age = Number(req.query.age)
            obj = {
                ...obj, maxAge: { $gt: age }, minAge: { $lt: age }
            }
        }
        if (req.query.gender) {
            obj["gender"] = req.query.gender
        }
        if (req.query.cast) {
            obj["cast"] = req.query.cast
        }

        let schems = await schemModel.find(
            {
                ...obj,
                name: {
                    $regex: name
                }
            }
        ).skip((pageNo - 1) * 10).limit(10).select("name image desc");
        res.json({ success: true, msg: schems });
    } catch (e) {
        res.json({ success: false, msg: e.message });
    }
}

const getSchemInfo = async (req, res) => {
    try {
        let { id } = req.params;
        let schems = await schemModel.findOne({ _id: id }).populate({
            path: "Type",
            select: "name isDoc",
        });
        if (!schems) throw new Error("no such schem");
        res.json({ success: true, msg: schems });
    } catch (e) {
        res.json({ success: false, msg: e.message });
    }
}

// admin

const addSchem = async (req, res) => {
    try {
        // validate req.body

        req.body = JSON.parse(JSON.stringify(req.body));

        let obj = {
            ...req.body,
            image: req.file ? req.file.filename : "",
        }

        // req.body.form = ["3329478","catebjd3829gory","income"]
        if (req.body.form) {
            let form = JSON.parse(req.body.form);
            obj['Type'] = form;
        }
        if (req.body.gender) {
            let gender = JSON.parse(req.body.gender);
            obj['gender'] = gender;
        }
        if (req.body.cast) {
            let cast = JSON.parse(req.body.cast);
            obj['cast'] = cast;
        }
        // if (req.body.criteria) {
        //     let crie = JSON.parse(req.body.criteria);
        //     obj['Criteria'] = crie;
        // }
        const schemNew = new schemModel(obj);
        await schemNew.save();
        res.json({ success: true, msg: schemNew });

    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const updateSchem = async (req, res) => {
    try {
        let { id } = req.params;
        schem = await schemModel.findOne({ _id: id });
        if (!schem) throw new Error("no such schem ");

        req.body = JSON.parse(JSON.stringify(req.body));

        // image remove from grid fs if updating image

        let obj = {
            ...req.body,
        }
        if (req.file) {
            obj["image"] = req.file.filename
        }

        if (req.body.form) {
            let form = JSON.parse(req.body.form);
            obj['Type'] = form;
        }

        if (req.body.gender) {
            let gender = JSON.parse(req.body.gender);
            obj['gender'] = gender;
        }
        if (req.body.cast) {
            let cast = JSON.parse(req.body.cast);
            obj['cast'] = cast;
        }
        // if (req.body.criteria) {
        //     let crie = JSON.parse(req.body.criteria);
        //     obj['Criteria'] = crie;
        // }


        newSchem = await schemModel.findOneAndUpdate({ _id: id }, obj, {
            new: true
        })

        res.json({ success: true, msg: newSchem });

    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const deleteSchem = async (req, res) => {
    try {
        let { id } = req.params;
        schem = await schemModel.findOne({ _id: id });
        if (!schem) throw new Error("no such schem ");
        // remove this id from users schem section
        let users = await usermodel.updateMany({}, {
            $pull: { schems: { schem: id } }
        })
        newSchem = await schemModel.deleteOne({ _id: id });

        res.json({ success: true, msg: id });

    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}


const searchSchema = async (req, res) => {
    // searching via name
    // filtering via cast like sc,st,obc - 63334f4f9a081a20e3b24d82
    // filtering via income - 6333b9e74769df8030e2ff68
    // via gender - 6333ba4d4769df8030e2ff73
    try {



        // let newData = data.filter((da) => {

        //     // taking schems one by one and applying filters
        //     let isSatisfy = true;
        //     let crie = da.Criteria;

        //     crie.forEach((one) => {


        //         let category = req.query.cat
        //         let income = req.query.income;
        //         let gender = req.query.gender;

        //         if (one.id.toString() == "63334f4f9a081a20e3b24d82") {

        //             if (category) {
        //                 // then only filter for category

        //                 let allowedCategory = one.criteria

        //                 if (allowedCategory) {
        //                     if (allowedCategory.find(x => x == category)) {
        //                         console.log(allowedCategory);
        //                         // include in op
        //                     } else {
        //                         // not include
        //                         isSatisfy = false;
        //                     }
        //                 } else {
        //                     // do not filter
        //                 }
        //             }

        //         } else if (one.id.toString() == "6333b9e74769df8030e2ff68") {

        //             if (income) {

        //                 let allowedIcome = one.criteria;

        //                 if (allowedIcome) {
        //                     if (Number(income) <= Number(allowedIcome)) {
        //                         console.log(income);
        //                         // include in op
        //                     } else {
        //                         // not include
        //                         isSatisfy = false;

        //                     }
        //                 } else {
        //                     // do not filter
        //                 }
        //             }

        //         } else if (one.id.toString() == "6333ba4d4769df8030e2ff73") {

        //             if (gender) {

        //                 let allowedGender = one.criteria;
        //                 if (allowedGender) {
        //                     if (allowedGender.find(x => x == gender)) {
        //                         console.log(one.criteria);
        //                         // include in op
        //                     } else {
        //                         // not include
        //                         isSatisfy = false;

        //                     }
        //                 } else {
        //                     // do not filter
        //                 }
        //             }
        //         }

        //     })

        //     if (isSatisfy) {
        //         return 1;
        //     }
        //     return 0;
        // })

        res.json({ success: true, msg: newData })
    }
    catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

module.exports = { searchSchema }


module.exports = { getSchems, getSchemInfo, addSchem, updateSchem, deleteSchem, searchSchema, getMyschema }