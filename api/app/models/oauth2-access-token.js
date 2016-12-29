var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment');

/**
 * Access Token Schema
 */
var AccessToken = mongoose.Schema({
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
 * @typedef AccessToken
 */
AccessToken.plugin( autoIncrement.plugin, 'AccessToken' );
module.exports = mongoose.model( 'AccessToken', AccessToken );
