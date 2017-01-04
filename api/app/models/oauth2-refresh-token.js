var mongoose = require( 'mongoose' ),
  autoIncrement = require( 'mongoose-auto-increment' );

/**
 * Refresh Token Schema
 */
var RefreshToken = mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * @typedef RefreshToken
 */
RefreshToken.plugin( autoIncrement.plugin, 'RefreshToken' );
module.exports = mongoose.model( 'RefreshToken', RefreshToken );
