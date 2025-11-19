import React from 'react';
import { Menu } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { getCurrentConversation } = useChatStore();
  const currentConversation = getCurrentConversation();

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 dark:border-gray-900/50 bg-white dark:bg-gpt-dark-bg">
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} className="text-gpt-light-text dark:text-gpt-dark-text" />
          </button>

          <h2 className="text-base font-semibold text-gpt-light-text dark:text-gpt-dark-text truncate max-w-md">
            {currentConversation?.title || 'ChatGPT'}
          </h2>
        </div>
      </div>
    </header>
  );
};
