const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message');
const checkAuth = require('../middleware/check-auth');

// USAGE: http://{HOST}:{PORT}/message/write
router.post('/write', checkAuth, MessageController.writeMessage);

router.get('/read', checkAuth, MessageController.readMessage);

router.get('/all', checkAuth, MessageController.getAllMessages);

router.get('/all-unread/', checkAuth, MessageController.getAllUnreadMessages);

router.delete('/remove/:msgId', checkAuth, MessageController.deleteMessage);

module.exports = router;
