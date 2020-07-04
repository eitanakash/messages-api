const mongoose = require("mongoose");
const Message = require('../models/message');
const User = require('../models/user');

exports.writeMessage = (req, res, next) => {
  let receiver;
  User.findOne({ email: req.body.receiver })
    .then((user) => {
      receiver = user
      return message = new Message({
        _id: new mongoose.Types.ObjectId(),
        sender: req.user,
        receiver: receiver,
        message: req.body.message,
        subject: req.body.subject,
      }).save()
    }).then((msg) => {
      receiver.addToInbox(msg.id)
      req.user.addToOutbox(msg.id)
      return res.status(200).json({ messages: 'message sent successfully', id: msg.id })
    }).catch(err => {
      res.status(500).json({
        error: err.message
      });
    })
};

exports.readMessage = async (req, res, next) => {
  const msgID = await req.user.readMessage()

  await Message.findOne({ _id: msgID }).populate('sender')
    .then(msg => {
      if (msg) {
        const message = {
          subject: msg.subject,
          message: msg.message,
          createdAt: msg.createdAt,
          sender: msg.sender.email
        }
        res.status(200).json({ message })
      } else {
        res.status(200).json({ message: 'No new messages ):' })
      }
    }).catch(err => {
      res.status(500).json({
        error: err.message
      });
    })
};

exports.getAllMessages = async (req, res, next) => {
  User.findOne({ _id: req.user.id })
    .select('unreadInbox readInbox outbox -_id').populate('unreadInbox readInbox outbox')
    .then(messages => {
      if (messages) {
        res.status(200).json(messages)
      } else {
        res.status(200).json({ message: `No new messages ):` })
      }
    }).catch(err => {
      res.status(500).json({
        error: err.message
      });
    })
};

exports.getAllUnreadMessages = (req, res, next) => {
  User.findOne({ _id: req.user.id })
    .select("unreadInbox").populate('unreadInbox')
    .then(messages => {
      if (messages) {
        res.status(200).json(messages.unreadInbox)
      } else {
        res.status(200).json({ message: `No new messages from ${req.params.user} ):` })
      }
    }).catch(err => {
      res.status(500).json({
        error: err.message
      });
    })
};

// Just sender (owner) can delete message
exports.deleteMessage = async (req, res, next) => {
  try {
    const result = await req.user.deleteMessage(req.params.msgId);
    if (result){
      res.status(200).json({ message: `message ID ${req.params.msgId}, from ${result} of user: ${req.user.email} deleted` });
    } else{
      res.status(400).json({ message: `message ID ${req.params.msgId} not exist` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
