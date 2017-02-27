var mongoose = require( 'mongoose' ),
  autoIncrement = require( 'mongoose-auto-increment' );

/**
 * oAuth2 UserParameter type schema
 */
var UserParameter = mongoose.Schema({
  alias: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  user: { type: Number, ref: 'User' }
});

/**
 * @typedef UserParameter
 */
UserParameter.plugin( autoIncrement.plugin, 'UserParameter' );
module.exports = mongoose.model( 'UserParameter', UserParameter );
