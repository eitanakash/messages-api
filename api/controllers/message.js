const mongoose = require("mongoose");
const Message = require('../models/message');

exports.writeMessage = (req, res, next) => {
  try {
    if (req.body.sender !== req.userData.email) {
      throw { msg: "Sender is not equal to logged user" }
    }
    const message = new Message({
      _id: new mongoose.Types.ObjectId(),
      sender: req.body.sender,
      receiver: req.body.receiver,
      message: req.body.message,
      subject: req.body.subject,
    });
    message.save().then(() => {
      res.status(201).json({ msg: 'message sent' })
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.readMessage = (req, res, next) => {
  Message.findOneAndUpdate({ receiver: req.userData.email, isReaded: false }, { isReaded: true }).then(msg => {
    if (msg) {
      const message = {
        subject: msg.subject,
        message: msg.message
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
  Message.find({ receiver: req.userData.email }).select("message subject sender receiver").exec().then(messages => {
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
  Message.find({ receiver: req.userData.email, sender: req.params.user, isReaded: false }).select("message subject sender receiver").exec().then(messages => {
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

exports.deleteMessage = (req, res, next) => {
  Message.deleteOne({ _id: req.params.msgId }).then(msg => {
    if (msg.result.n) {
      res.status(200).send(`messaage content: ${msg.message}, id ${req.params.msgId} delete `)
    } else {
      res.status(200).json({ message: 'Mesage id not exist' })
    }
  }).catch(err => {
    res.status(500).json({
      error: err.message
    });
  })
};
