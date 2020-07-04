const mongoose = require('mongoose');
const message = require('./message');
const Schema = mongoose.Schema;



const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String, required: true },
  messages: {
    inbox: [
      { type: Schema.Types.ObjectId, ref: 'Message', require: true }
    ],
    outbox: [
      { type: Schema.Types.ObjectId, ref: 'Message', require: true }
    ]
  }
});

userSchema.methods.addToInbox = function (message) {
  const inMessages = [...this.messages.inbox];
  inMessages.push(message);
  this.messages.inbox = inMessages;
  return this.save();
}
userSchema.methods.addToOutbox = function (message) {
  const outMessages = [...this.messages.outbox];
  outMessages.push(message);
  this.messages.outbox = outMessages;
  return this.save();
}


module.exports = mongoose.model('User', userSchema);