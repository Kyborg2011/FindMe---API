var mongoose = require( 'mongoose' ),
  autoIncrement = require( 'mongoose-auto-increment' ),
  Message = require( './message' ),
  Float = require( 'mongoose-float' ).loadType( mongoose, 2 );

// Discriminators - a mongoose schema inheritance mechanism
var options = { discriminatorKey: 'kind' };

/**
 * Latecomer Location Message type schema (parent type is Location Message)
 */
var LatecomerMessage = mongoose.Schema({
  currentLocation: { type: Number, ref: 'Point' },
  template: { type: mongoose.Schema.Types.Mixed },
  attachments: [{
    mimeType: { type: String },
    url: { type: String },
    notes: { type: String }
  }],
  isAccepted: { type: Number },
  speed: { type: Float },
  arrivalCoordinates: {
    lat: { type: Float },
    lng: { type: Float }
  },
  arrivalAddress: { type: String }
}, options );

/**
 * @typedef Latecomer Location Message
 */
LatecomerMessage.plugin( autoIncrement.plugin, 'LatecomerMessage' );
module.exports = Message.discriminator( 'latecomer', LatecomerMessage );
