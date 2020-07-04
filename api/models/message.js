const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  isReaded: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

});

module.exports = mongoose.model('Message', messageSchema);