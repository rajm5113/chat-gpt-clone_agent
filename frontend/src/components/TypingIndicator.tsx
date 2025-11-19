import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="w-full border-b border-black/10 dark:border-gray-900/50 bg-gpt-light-message dark:bg-gpt-dark-message">
      <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 flex gap-6">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-gpt-light-text-secondary dark:bg-gpt-dark-text-secondary rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-gpt-light-text-secondary dark:bg-gpt-dark-text-secondary rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-gpt-light-text-secondary dark:bg-gpt-dark-text-secondary rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
