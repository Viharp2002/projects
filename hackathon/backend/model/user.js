const mongo = require('mongoose');
let userSchema = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cast: {
        type: String
    },
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    income: {
        type: Number
    },
    schems: {
        type: [{
            schem: {
                type: mongo.SchemaTypes.ObjectId,
                ref: 'schem'
            },
            isVerified: {
                type: Boolean,
                default: false
            }
        }],
        // indicates in which schems user has applied
    },
    information: {
        type: [{
            formfield: {
                type: mongo.SchemaTypes.ObjectId,
                ref: "form"
            },
            data: String,
            doc: String
        }],
        default: []
    }
})

module.exports = new mongo.model('user', userSchema);