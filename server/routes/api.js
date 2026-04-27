const express = require('express');
const router = express.Router();
const {
  createSession,
  getChatHistory,
  handleChat,
  getKnowledgeBase
} = require('../controllers/chatController');

router.post('/session', createSession);
router.get('/chat/:sessionId', getChatHistory);
router.post('/chat', handleChat);
router.get('/knowledge', getKnowledgeBase);

module.exports = router;
