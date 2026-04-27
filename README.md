# IT Department Chatbot - DYPCOE Akurdi

A full-stack MERN chatbot for the Information Technology Department of D.Y. Patil College of Engineering, Akurdi. It answers queries related to the department using a pre-loaded knowledge base and Google's Gemini AI.

## Technologies Used
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini API (`gemini-2.5-flash`)

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on port 27017
- Google Gemini API Key

### 1. Setup Backend
1. Open terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Edit the `.env` file and insert your Google Gemini API Key:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/itdept_chatbot
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
4. Seed the database:
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   node index.js
   ```

### 2. Setup Frontend
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL (usually `http://localhost:5173`) in your browser.

## Features
- Context-aware answers based on department data.
- Session persistence to remember chat history.
- Dynamic, responsive UI with Markdown rendering and typing indicators.
