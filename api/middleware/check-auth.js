const jwt = require('jsonwebtoken');
require("dotenv").config();
const mongoose = require("mongoose");
const User = require('../models/user');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    User.findOne({ email: decoded.email }).then((user) => {
      console.log(`Logged in user found, email ${user.email}, id: ${user.id} `);
      req.user = user
    }).then(() => {
      next()
    })
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
      reason: error.message,
    });
  }
};