import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex w-full justify-start mb-4">
      <div className="flex max-w-[85%] md:max-w-[75%] flex-row items-end gap-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-brand text-white shadow-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8"></path>
            <rect x="4" y="8" width="16" height="12" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>
        </div>
        
        <div className="px-4 py-4 rounded-2xl shadow-sm bg-white border border-gray-100 rounded-bl-none flex items-center justify-center gap-1">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
