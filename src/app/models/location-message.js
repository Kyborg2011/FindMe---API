var mongoose = require( 'mongoose' ),
  autoIncrement = require( 'mongoose-auto-increment' ),
  Message = require( './message' );

// Discriminators - a mongoose schema inheritance mechanism
var options = { discriminatorKey: 'kind' };

/**
 * Location Message type schema (parent type is Message)
 */
var LocationMessage = mongoose.Schema({
  currentLocation: { type: Number, ref: 'Point' },
  isAccepted: { type: Number }
}, options );

/**
 * @typedef Location Message
 */
LocationMessage.plugin( autoIncrement.plugin, 'LocationMessage' );
module.exports = Message.discriminator( 'location', LocationMessage );
