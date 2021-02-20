const mongoose = require('mongoose');
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
  unreadInbox: [{ type: Schema.Types.ObjectId, ref: 'Message', require: true }],
  readInbox: [{ type: Schema.Types.ObjectId, ref: 'Message', require: true }],
  outbox: [{ type: Schema.Types.ObjectId, ref: 'Message', require: true }]
});

userSchema.methods.addToInbox = function (message) {
  const inMessages = [...this.unreadInbox];
  inMessages.push(message);
  this.unreadInbox = inMessages;
  return this.save();
}

userSchema.methods.addToOutbox = function (message) {
  const messagesIds = [...this.outbox];
  messagesIds.push(message);
  this.outbox = messagesIds;
  return this.save();
}

userSchema.methods.readMessage = function () {
  const unreadeaMessages = [...this.unreadInbox];
  const readedMessages = [...this.readInbox];

  if (unreadeaMessages.length) {
    const msgId = unreadeaMessages.shift();
    if (msgId) {
      readedMessages.push(msgId)
    };
    this.unreadInbox = unreadeaMessages;
    this.readInbox = readedMessages;
    this.save();
    return msgId;
  } else {
    return;
  }
}

userSchema.methods.deleteMessage = function (msgId) {
  const unreadeaMessages = this.unreadInbox;
  const readedMessages = this.readInbox;
  const outboxMessage = this.outbox;
  let result;

  if (unreadeaMessages.includes(msgId)) {
    const index = unreadeaMessages.indexOf(msgId);
    unreadeaMessages.splice(index, 1);
    this.unreadInbox = unreadeaMessages;
    result = 'unread messages';
    
  } else if (readedMessages.includes(msgId)) {
    const index = readedMessages.indexOf(msgId);
    readedMessages.splice(index, 1);
    this.readInbox = readedMessages;
    result = 'readed messages';
    
  } else if (outboxMessage.includes(msgId)) {
    const index = outboxMessage.indexOf(msgId);
    outboxMessage.splice(index, 1);
    this.outbox = outboxMessage;
    result = 'outbox messages';
  } 

  this.save();
  return result;
}


module.exports = mongoose.model('User', userSchema);