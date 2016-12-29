var mongoose = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment'),
  Message = require('./message');

// Discriminators - a mongoose schema inheritance mechanism
var options = { discriminatorKey: 'kind' };

/**
 * Request Location Message type schema (parent type is Message)
 */
var RequestLocationMessage = mongoose.Schema( {
  isAccepted: { type: Number }
}, options );

/**
 * @typedef Request Location Message
 */
RequestLocationMessage.plugin( autoIncrement.plugin, 'RequestLocationMessage' );
module.exports = Message.discriminator( 'request-location', RequestLocationMessage );
