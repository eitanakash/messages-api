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

exports.readMessage = (req, res, next) => {
  Message.findOneAndUpdate({ receiver: req.user.id, isReaded: false }, { isReaded: true })
    .then(msg => {
      if (msg) {
        const message = {
          subject: msg.subject,
          message: msg.message,
          createdAt: msg.createdAt
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

exports.getAllMessages = (req, res, next) => {
  Message.find({ receiver: req.user.id })
    .select("message subject sender receiver isReaded")
    .exec()
    .then(messages => {
      if (messages) {
        res.status(200).json(messages)
      } else {
        res.status(200).json({ message: 'No messages ):' })
      }
    }).catch(err => {
      res.status(500).json({
        error: err.message
      });
    })
};

exports.getAllUnreadMessages = (req, res, next) => {
  Message.find({ receiver: req.user.id, isReaded: false })
    .select("message subject sender receiver isReaded")
    .exec()
    .then(messages => {
      if (messages) {
        res.status(200).json(messages)
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
exports.deleteMessage = (req, res, next) => {
  Message.findOne({ _id: req.params.msgId }).then(msg => {
    if (!msg) {
      res.status(400).json({ message: 'Mesage ID not exist' })
      return;
    }
    console.log(`msg sender: ${msg.sender} loggedIn user: ${req.user.id} receiver: ${msg.receiver}`);
    if (msg.sender.toHexString() === req.user.id) {
      msg.remove()
      res.status(200).json({ message: `message ID ${msg.sender.toHexString()}, from ${req.user.email} deleted` });
    } else {
      res.status(400).json({ message: `User  ${req.user.email} not allow to delete message ID: ${msg.sender.toHexString()}` });
    }
  }).catch(err => {
    res.status(500).json({
      error: err.message
    });
  })
};
