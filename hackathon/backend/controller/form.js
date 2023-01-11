const formF = require("../model/formField")

const get_form_field = async (req, res) => {
    try {
        let data = await formF.find();
        res.json({ success: true, msg: data });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const update = async (req, res) => {
    try {
        let id = req.params.id;
        let data = await formF.findOneAndUpdate({ _id: id }, req.body);
        res.json({ success: true, msg: data });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const add_form_field = async (req, res) => {
    try {
        let create = new formF(req.body);
        await create.save();
        res.json({ success: true, msg: create });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const getName = async (req, res) => {
    try {
        let { id } = req.params
        let create = await formF.findOne({ _id: id })
        res.json({ success: true, msg: create });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

module.exports = { add_form_field, get_form_field, getName, update }