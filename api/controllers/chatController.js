const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');
const ChatSession = require('../models/ChatSession');
const KnowledgeBase = require('../models/KnowledgeBase');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache for knowledge base
let kbContext = '';

// Load knowledge base into memory
const loadKnowledgeBase = async () => {
  try {
    const data = await KnowledgeBase.find({});
    kbContext = data.map(item => `Category: ${item.category}\nTitle: ${item.title}\nContent:\n${item.content}\nSource: ${item.source}`).join('\n\n---\n\n');
    console.log('Knowledge base loaded into memory.');
  } catch (err) {
    console.error('Error loading knowledge base:', err);
  }
};

const createSession = async (req, res) => {
  try {
    const sessionId = uuidv4();
    const session = new ChatSession({ sessionId, messages: [] });
    await session.save();
    res.status(201).json({ sessionId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session.messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

const handleChat = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ message: 'Session ID and message are required' });
    }

    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      // Auto-create session if not found
      session = new ChatSession({ sessionId, messages: [] });
    }

    // Add user message to DB
    session.messages.push({ role: 'user', content: message });
    
    // Prepare conversation history for Gemini
    // Gemini expects 'user' or 'model' roles, and parts array
    const historyMessages = session.messages.slice(0, -1); // all except the latest user message
    const history = historyMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const systemPrompt = `You are an AI assistant for the Information Technology Department of D.Y. Patil College of Engineering, Akurdi (DYPCOE Akurdi), affiliated with Savitribai Phule Pune University (SPPU).

Your job is to answer questions from students, parents, and visitors about the IT department. Only answer based on the knowledge base provided below. If you don't know something, say "I don't have that information. Please contact the department directly."

Be friendly, concise, and helpful. Use bullet points for lists. Format syllabus-related answers clearly by semester and subject. If the user asks something outside the knowledge base scope, politely say you can only answer IT department-related questions and suggest visiting www.dypcoeakurdi.ac.in.

--- KNOWLEDGE BASE ---
${kbContext}`;

    // Initialize Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // Call Gemini API
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const assistantReply = result.response.text();

    // Save assistant reply to DB
    session.messages.push({ role: 'assistant', content: assistantReply });
    await session.save();

    res.status(200).json({ reply: assistantReply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing chat', error: error.message });
  }
};

const getKnowledgeBase = async (req, res) => {
  try {
    const data = await KnowledgeBase.find({}, 'category title');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching knowledge base', error: error.message });
  }
};

module.exports = {
  createSession,
  getChatHistory,
  handleChat,
  getKnowledgeBase,
  loadKnowledgeBase
};
