var mongoose = require('mongoose')
  autoIncrement = require('mongoose-auto-increment');

/**
 * oAuth2 client type schema
 */
var Client = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  clientId: {
    type: String,
    unique: true,
    required: true
  },
  clientSecret: {
    type: String,
    required: true
  }
});

/**
 * @typedef Client
 */
Client.plugin( autoIncrement.plugin, 'Client' );
module.exports = mongoose.model( 'Client', Client );
