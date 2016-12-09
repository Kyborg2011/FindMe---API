// app/models/object.js

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

// Client MongoDB Model
var Object = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    full_name: {
        type: String
    },
    operation_system: {
        type: String
    },
    imei: {
        type: String
    },
    firebase_token:  {
        type: String
    },
    active: {
        type: Number,
        required: true
    },
    activation_code: {
        type: String
    },
    states: [{ type: mongoose.Schema.Types.ObjectId, ref: 'State' }]
});

Object.plugin(autoIncrement.plugin, 'Object');
module.exports = mongoose.model('Object', Object);
