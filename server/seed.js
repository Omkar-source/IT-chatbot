const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const KnowledgeBase = require('./models/KnowledgeBase');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const seedDatabase = async () => {
  try {
    // Read JSON file
    const dataPath = path.join(__dirname, 'data', 'seedData.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Clear existing data
    await KnowledgeBase.deleteMany({});
    console.log('Existing knowledge base cleared.');

    // Insert new data
    for (const item of data) {
      await KnowledgeBase.create(item);
      console.log(`Inserted category: ${item.category}`);
    }

    console.log('Data Successfully Seeded!');
    process.exit();
  } catch (error) {
    console.error('Error with seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
