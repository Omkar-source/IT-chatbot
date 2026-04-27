import React from 'react';
import { Lightbulb } from 'lucide-react';

const SUGGESTIONS = [
  "What subjects are in Semester 3?",
  "Who is the HOD?",
  "What facilities does the department have?",
  "Tell me about student achievements",
  "What MOUs does the department have?",
  "Tell me about the NBA accreditation"
];

const SuggestionChips = ({ onSelect }) => {
  return (
    <div className="w-full mt-6 mb-2">
      <div className="flex items-center gap-2 mb-3 text-gray-500 text-sm font-medium px-2">
        <Lightbulb size={16} className="text-amber-500" />
        <span>Suggested queries</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="px-4 py-2 bg-white border border-brand/20 text-brand-dark text-sm rounded-full hover:bg-brand/5 hover:border-brand/40 transition-all duration-200 text-left shadow-sm hover:shadow active:scale-95"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionChips;
