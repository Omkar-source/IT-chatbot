# Full-Stack MERN Chatbot for DYPCOE Akurdi IT Department

This plan outlines the architecture and implementation steps to build the full-stack MERN chatbot web application serving as a virtual assistant for the Information Technology Department of DYPCOE Akurdi.

## User Review Required

> [!IMPORTANT]
> - The Anthropic Claude API model specified is `claude-sonnet-4-20250514`, which is not a standard model name (usually it's `claude-3-5-sonnet-20240620` or similar). Please confirm if you want me to use the latest Claude 3.5 Sonnet or a specific version you have access to. 
> - I will set up the frontend in the `client` directory and backend in the `server` directory within the workspace `c:\Users\omkar\OneDrive\Desktop\chatbot`. Please confirm this location.

## Open Questions

- Should the seed script expect plain `.txt` files or structured `.json` files in `/server/data/`? I will default to `.json` files for easier parsing of categories and titles.
- Do you want to use Vite for the React frontend setup? (It is faster and more modern than Create React App). I will proceed with Vite unless otherwise specified.

## Proposed Changes

---
### Backend (Node.js + Express)

#### [NEW] server/package.json
Initialize Node project with dependencies: `express`, `mongoose`, `cors`, `dotenv`, `@anthropic-ai/sdk`, `uuid`.

#### [NEW] server/.env
Environment variables template containing `MONGO_URI`, `ANTHROPIC_API_KEY`, and `PORT`.

#### [NEW] server/config/db.js
MongoDB connection logic using Mongoose.

#### [NEW] server/models/KnowledgeBase.js
Mongoose schema for the knowledge base (category, title, content, source).

#### [NEW] server/models/ChatSession.js
Mongoose schema for chat sessions (sessionId, messages, createdAt).

#### [NEW] server/data/seedData.json
Dummy data acting as the knowledge base, extracted from the provided websites and PDFs.

#### [NEW] server/seed.js
Script to connect to MongoDB, read `seedData.json`, clear existing knowledge base data, insert the new documents, and log the results.

#### [NEW] server/controllers/chatController.js
Business logic for handling chat interactions:
- Generating session IDs.
- Fetching chat history.
- Querying Claude API with the loaded knowledge base context.
- Saving new messages to the database.

#### [NEW] server/routes/api.js
Express router defining endpoints:
- `POST /api/chat`
- `GET /api/chat/:sessionId`
- `POST /api/session`
- `GET /api/knowledge`

#### [NEW] server/index.js
Entry point for the backend, setting up Express, middlewares (cors, json), routes, and starting the server. It will also load the knowledge base into memory for fast access.

---
### Frontend (React + Tailwind CSS)

#### [NEW] client/
Initialize Vite React app. Install dependencies: `axios`, `react-markdown`, `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react` (for icons).

#### [NEW] client/tailwind.config.js & index.css
Configure Tailwind CSS to style the chat interface with a premium, dynamic design (vibrant colors, smooth transitions, modern typography).

#### [NEW] client/src/App.jsx
Main application component managing state (messages, session ID, loading state) and layout. Includes:
- Header with logo/name.
- Chat window auto-scrolling to the latest message.
- Input bar with send button.

#### [NEW] client/src/components/ChatMessage.jsx
Component rendering individual message bubbles, handling user vs. assistant styling and markdown rendering.

#### [NEW] client/src/components/TypingIndicator.jsx
Animated dots indicating the bot is "thinking".

#### [NEW] client/src/components/SuggestionChips.jsx
Quick-reply buttons shown on the initial load.

#### [NEW] client/src/services/api.js
Axios wrapper to handle communication with the backend API.

---
### Root

#### [NEW] README.md
Comprehensive setup instructions covering dependencies installation, seeding the database, and running both servers.

## Verification Plan

### Automated Tests
- The backend will be tested via API calls to ensure Claude API integration works and the knowledge base is injected correctly.

### Manual Verification
- Run the seed script to verify successful insertion into MongoDB.
- Start backend and frontend servers.
- Interact with the chatbot in the browser to test session persistence, quick replies, markdown rendering, and accurate answers based on the knowledge base.
- Verify responsive design on various viewport sizes.
