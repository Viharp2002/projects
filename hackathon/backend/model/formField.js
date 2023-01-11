// all the form fields indicating specific string like name,category,proffesion 

const mongo = require('mongoose');


const form = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    isDoc: {
        type: Boolean,
        default: false
    },
    requiredDocLink: {
        type: String
    }

})

module.exports = new mongo.model('form', form);