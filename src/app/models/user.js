var mongoose = require( 'mongoose' ),
  autoIncrement = require( 'mongoose-auto-increment' ),
  bcrypt = require( 'bcrypt-nodejs' );

/**
 * User Schema
 */
var User = mongoose.Schema({
  local: {
    fullName: String,
    phone: {
      type: String,
      unique: true,
      required: true
    },
    email: String,
    password: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  isActive: Number,
  oAuthAccessToken: String,
  contacts: [String],
  activationCode: String,
  firebaseToken: String,
  google: {
    id: String
  },
  facebook: {
    id: String
  }
});

/**
 * Schema's methods:
 */
User.methods.generateHash = function( password ) {
  return bcrypt.hashSync( password, bcrypt.genSaltSync( 8 ), null );
};
User.methods.validPassword = function( password ) {
  return bcrypt.compareSync( password, this.local.password );
};

/**
 * Schema's virtual attributes:
 */
User.virtual( 'userId' )
  .get( function() {
    return this.id;
  });

/**
 * @typedef User
 */
User.plugin( autoIncrement.plugin, 'User' );
module.exports = mongoose.model( 'User', User );
