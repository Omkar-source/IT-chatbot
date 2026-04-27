const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars before importing routes/controllers
dotenv.config();

const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const { loadKnowledgeBase } = require('./controllers/chatController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Connect to DB
let isDbConnected = false;

const initializeServer = async () => {
  if (!isDbConnected) {
    await connectDB();
    await loadKnowledgeBase();
    isDbConnected = true;
  }
};

// For local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  initializeServer().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// For Vercel Serverless
module.exports = async (req, res) => {
  await initializeServer();
  return app(req, res);
};
