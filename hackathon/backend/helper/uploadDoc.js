const uploadDoc = async (req, res) => {
    // console.log(req.files['category'][0].filename,req.files['education'])
    try {

        if (!req.files) throw new Error("file should be there with any of this name : category,education");

        let resObj = {};

        if (req.files['cast']) {
            resObj = { link: req.files['cast'][0].filename, name: "cast" }
        } else if (req.files['income']) {
            resObj = { link: req.files['income'][0].filename, name: "income" }
        } else if (req.files['adhar card']) {
            resObj = { link: req.files['adhar card'][0].filename, name: "adhar card" }
        } else if (req.files['std 10 marksheet']) {
            resObj = { link: req.files['std 10 marksheet'][0].filename, name: "std 10 marksheet" }
        } else if (req.files['std 12 marksheet']) {
            resObj = { link: req.files['std 12 marksheet'][0].filename, name: "std 12 marksheet" }
        } else if (req.files['fee receipt']) {
            resObj = { link: req.files['fee receipt'][0].filename, name: "fee receipt" }
        } else if (req.files['self declaration']) {
            resObj = { link: req.files['self declaration'][0].filename, name: "self declaration" }
        } else if (req.files['letter of hod']) {
            resObj = { link: req.files['letter of hod'][0].filename, name: "letter of hod" }
        } else if (req.files['hostel receipt']) {
            resObj = { link: req.files['hostel receipt'][0].filename, name: "hostel receipt" }
        } else if (req.files['passbook']) {
            resObj = { link: req.files['passbook'][0].filename, name: "passbook" }
        } else if (req.files['IT return']) {
            resObj = { link: req.files['IT return'][0].filename, name: "IT return" }
        } else if (req.files['photo']) {
            resObj = { link: req.files['photo'][0].filename, name: "photo" }
        } else {
            throw new Error("invalid fileName");
        }

        res.json({ success: true, msg: resObj });

    } catch (e) {
        res.json({ success: false, msg: e.message })
    }

}

module.exports = uploadDoc