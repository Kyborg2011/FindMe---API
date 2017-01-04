var mongoose = require( 'mongoose' ),
  autoIncrement = require( 'mongoose-auto-increment' ),
  Float = require( 'mongoose-float' ).loadType( mongoose, 2 );

/**
 * Point type schema
 */
var Point = mongoose.Schema({
  user: { type: Number, ref: 'User' },
  lat: { type: Float, required: true },
  lng: { type: Float, required: true },
  altitude: { type: Float, required: true },
  parameters: { type: mongoose.Schema.Types.Mixed },
  address: { type: String },
  notes: { type: String },
  created: {
    type: Date,
    default: Date.now
  },
  attachments: [{
    mimeType: { type: String },
    url: { type: String },
    notes: { type: String }
  }]
});

/**
 * @typedef Point
 */
Point.plugin( autoIncrement.plugin, 'Point' );
module.exports = mongoose.model( 'Point', Point );
