// app/models/user.js

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local            : {
        full_name    : String,
        phone        : String,
        email        : String,
        password     : String,
        active       : Number,
        activation_code: String,
        firebase_token:  String,
        created: {
            type: Date,
            default: Date.now
        }
    },
    google           : {
        id           : String
    },
    facebook         : {
        id           : String
    },
    access_token     : String
});

// methods ======================

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.virtual('userId')
    .get(function () {
        return this.id;
    });

module.exports = mongoose.model('User', userSchema);
