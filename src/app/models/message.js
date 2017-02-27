var mongoose = require( 'mongoose' ),
  autoIncrement = require( 'mongoose-auto-increment' );

var options = { discriminatorKey: 'kind' };

/**
 * Message type schema
 */
var Message = mongoose.Schema({
  kind: { type: String },
  sender: { type: Number, ref: 'User' },
  recipient: { type: Number, ref: 'User' },
  parentMessage: { type: Number, ref: 'Message' },
  text: { type: String },
  template: { type: mongoose.Schema.Types.Mixed },
  createdDate: {
    type: Date,
    default: Date.now
  },
  readDate: {
    type: Date,
    default: Date.now
  },
  isVisited: { type: Number }
}, options );

/**
 * @typedef Message
 */
Message.plugin( autoIncrement.plugin, 'Message' );
module.exports = mongoose.model( 'Message', Message );
