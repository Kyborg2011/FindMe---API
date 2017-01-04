var mongoose = require( 'mongoose' );
autoIncrement = require( 'mongoose-auto-increment' );

/**
 * oAuth2 UserTemplate type schema
 */
var UserTemplate = mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
  messageType: { type: Number },
  user: { type: Number, ref: 'User' }
});

/**
 * @typedef UserTemplate
 */
UserTemplate.plugin( autoIncrement.plugin, 'UserTemplate' );
module.exports = mongoose.model( 'UserTemplate', UserTemplate );
