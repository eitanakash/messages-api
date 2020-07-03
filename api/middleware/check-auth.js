const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;    
    const decoded = jwt.verify(token,  process.env.JWT_KEY);
    req.userData = decoded;
    console.log(`User ${req.userData.email} logged in`);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
      reason: error.message,
    });
  }
};