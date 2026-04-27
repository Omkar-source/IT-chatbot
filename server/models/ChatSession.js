const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const chatSessionSchema = mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession;
