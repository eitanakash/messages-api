const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
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