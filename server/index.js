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

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
connectDB().then(async () => {
  await loadKnowledgeBase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
