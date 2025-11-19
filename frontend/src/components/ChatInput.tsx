import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  disabled = false,
  isStreaming = false,
  placeholder = 'Message ChatGPT...',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full resize-none rounded-2xl border border-gpt-light-border dark:border-gpt-dark-border bg-white dark:bg-gpt-dark-message px-4 py-3 pr-12 text-gpt-light-text dark:text-gpt-dark-text placeholder-gpt-light-text-secondary dark:placeholder-gpt-dark-text-secondary focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          style={{ minHeight: '52px', maxHeight: '200px' }}
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="absolute right-3 bottom-3 p-2 rounded-lg bg-gpt-light-text dark:bg-gpt-dark-text text-white transition-colors"
            title="Stop generating"
          >
            <div className="w-5 h-5 border-2 border-white"></div>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`absolute right-3 bottom-3 p-2 rounded-lg transition-colors ${
              message.trim() && !disabled
                ? 'bg-gpt-light-text dark:bg-gpt-dark-text text-white hover:opacity-80'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </form>
    </div>
  );
};
