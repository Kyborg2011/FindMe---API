// app/models/state.js

var mongoose = require('mongoose');

// Client MongoDB Model
var State = mongoose.Schema({
    object: {
        type: Number,
        required: true,
        ref: 'Object'
    },
    lng: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    battery_level: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('State', State);
