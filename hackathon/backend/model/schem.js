
const mongo = require('mongoose');

let schemSchema = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    desc: {
        type: String,
        required: true
    },
    gender: {
        type: [String],
        default: ["male", "female", "other"]
    },
    cast: {
        type: [String],
        default: ["sc", "st", "obc", "open"]
    },
    Income: {
        type: Number,
        default: Number.MAX_VALUE
    },
    minAge: {
        type: Number,
        default: 0
    },
    maxAge: {
        type: Number,
        default: 100
    },
    Type: {
        type: [mongo.SchemaTypes.ObjectId],
        ref: 'form',
        default: []
    },
    Domain: {
        type: String,
        // required: true
    }
    // Criteria: [{
    //     id: {
    //         type: mongo.SchemaTypes.ObjectId,
    //         ref: 'form'
    //     },
    //     criteria: mongo.SchemaTypes.Mixed
    // }]

}
    // category,income,proffesion

    // start date for apply
    // deadline for apply

    // one field indicating in which category this schem belongs like school or farmer oe etc
)

module.exports = new mongo.model('schem', schemSchema);