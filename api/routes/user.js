const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

// USAGE: http://{HOST}:{PORT}/user/signup
router.post("/signup", UserController.userSignup);

router.post("/login", UserController.userLogin);

module.exports = router;
