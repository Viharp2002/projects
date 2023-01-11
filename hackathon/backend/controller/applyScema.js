const genPdf = require("../helper/genPdf");
const userModel = require("../model/user")
const schemModel = require("../model/schem")

const applySchem = async (req, res) => {

    try {

        let obj = {
            schem: req.body.schem,
            isVerified: false,
        }


        // validating data
        let user = await userModel.findOne({ _id: req.user });

        // if (user.schems.find((one) => {
        //     return one.schem.toString() == obj.schem.toString();
        // })) {
        //     throw new Error("already applied");
        // }

        let old_info = Array.from(user.information);
        let data = req.body.data;
        let new_info = old_info.map((old) => {
            let item = data.find(one => one.formfield?.toString() == old.formfield.toString())
            if (item) {
                return { ...old.toObject(), ...item }
            }
            return old;
        })

        data.forEach((item) => {
            let find = old_info.find(old => item.formfield?.toString() == old.formfield.toString())
            if (!find) {
                new_info.push(item);
            }
        })

        let new_user = await userModel.findOneAndUpdate({ _id: req.user }, {
            $push: { schems: obj },
            $set: { information: new_info }
        }, { new: true });

        // generating pdf & sending in mail

        // also user can print his application from
        // console.log(req.body);
        // let some = await userModel.findOne({ _id: req.user });
        // console.log(some);

        // pdfData['user'] = some.user.name
        // pdfData['mail'] = some.user.mail
        // pdfData['schem'] = some.schem.name

        res.json({ success: true, msg: new_user });


        // genPdf(pdfData);
    } catch (e) {
        res.json({ success: false, msg: e.stack })
    }
}

const hasAlready = async (req, res) => {
    try {
        const bool = await userModel.findOne({ _id: req.user });
        let exist = Array.from(bool.schems).find(sche => sche.schem.toString() == req.body.schem.toString())
        if (exist) {
            return res.json({ success: true, msg: true })
        }
        return res.json({ success: true, msg: false })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const getAllApplications = async (req, res) => {
    try {
        let all = await userModel.find().populate({
            path: "schems.schem",
            select: "name"
        }).select("_id name mail schems");
        res.json({ success: true, msg: all })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const OneApplication = async (req, res) => {
    try {
        let { uid, sid } = req.params;
        // validate uid & sid .
        // must be valid like uid- user have must applied to sid:schem
        let schem = await schemModel.findOne({ _id: sid })
        let user = await userModel.findOne({ _id: uid }).populate({
            path: "information.formfield",
            select: "name"
        });
        // console.log(schem,user);

        // user- has all information but from that we want information which are in schem-type

        let information = user.information.filter((one) => {
            if (schem.Type.find(sche => sche.toString() == one.formfield._id.toString())) {
                return 1;
            }
        })

        const isVerified = user.schems.find((schem) => schem.schem.toString() == sid.toString()).isVerified;

        let resObj = {
            sid: schem._id,
            sname: schem.name,
            sdesc: schem.desc,
            simg: schem.image,
            uid: user._id,
            uname: user.name,
            umail: user.mail,
            information,
            isVerified
        }

        res.json({ success: true, msg: resObj });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const usersOfSchem = async (req, res) => {
    let { id } = req.params;
    try {
        let users = await userModel.find({
            schems: { $elemMatch: { schem: id } }
        });
        res.json({ success: true, msg: users })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}



const verify_user = async (req, res) => {
    try {
        // validate the user & schem
        let { user, schem } = req.body;
        let all = await userModel.findOneAndUpdate({ _id: user, "schems.schem": schem }, {
            $set: {
                "schems.$.isVerified": true
            }
        }, { new: true });
        res.json({ success: true, msg: all })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}


module.exports = { OneApplication, applySchem, getAllApplications, usersOfSchem, verify_user, hasAlready }