import React, { useState, useEffect, useRef } from 'react';
import { Send, PlusCircle, Bot } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import TypingIndicator from './components/TypingIndicator';
import SuggestionChips from './components/SuggestionChips';
import { createSession, getChatHistory, sendMessage } from './services/api';

function App() {
  const [sessionId, setSessionId] = useState(sessionStorage.getItem('chatSessionId'));
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const [initError, setInitError] = useState(null);

  // Initialize session and fetch history
  useEffect(() => {
    const initChat = async () => {
      try {
        let currentSessionId = sessionId;
        
        if (!currentSessionId) {
          currentSessionId = await createSession();
          sessionStorage.setItem('chatSessionId', currentSessionId);
          setSessionId(currentSessionId);
        } else {
          const history = await getChatHistory(currentSessionId);
          setChatHistory(history);
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        const errMsg = error.response?.data?.error || error.message || 'Failed to connect to server';
        setInitError(errMsg);
      }
    };

    initChat();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = async (e, customMessage = null) => {
    if (e) e.preventDefault();
    
    const messageToSend = customMessage || inputValue;
    if (!messageToSend.trim() || !sessionId) return;

    // Add user message to UI immediately
    const newUserMsg = { role: 'user', content: messageToSend };
    setChatHistory(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const reply = await sendMessage(sessionId, messageToSend);
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: '**Error:** Failed to connect to the server. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      sessionStorage.removeItem('chatSessionId');
      const newSessionId = await createSession();
      sessionStorage.setItem('chatSessionId', newSessionId);
      setSessionId(newSessionId);
      setChatHistory([]);
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-md">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">IT Department Assistant</h1>
              <p className="text-xs text-gray-500 font-medium">DYPCOE Akurdi</p>
            </div>
          </div>
          
          <button 
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-4 py-6 scroll-smooth">
        {initError ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-10">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
              <Bot size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-red-500 mb-8">{initError}. Please check your backend connection.</p>
          </div>
        ) : (chatHistory || []).length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-10">
            <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6">
              <Bot size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How can I help you today?</h2>
            <p className="text-gray-500 mb-8">
              Ask me anything about the IT department syllabus, faculty, facilities, or student achievements.
            </p>
            <SuggestionChips onSelect={(msg) => handleSend(null, msg)} />
          </div>
        ) : (
          <div className="flex flex-col pb-4">
            {(chatHistory || []).map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSend}
            className="flex items-center bg-gray-100 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-brand/50 focus-within:border-brand transition-all shadow-sm pl-4 pr-1 py-1"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 py-2"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`p-2.5 rounded-full flex items-center justify-center transition-colors ${
                inputValue.trim() && !isLoading
                  ? 'bg-brand text-white hover:bg-brand-dark shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-xs text-gray-400">
              AI Assistant for Information Technology Dept, DYPCOE. Answers are based on department knowledge base.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
