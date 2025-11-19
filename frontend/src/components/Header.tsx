import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useChatStore } from '../store/chatStore';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { getCurrentConversation } = useChatStore();
  const currentConversation = getCurrentConversation();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-bg-light rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-gray-700 dark:text-dark-text" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text truncate max-w-md">
            {currentConversation?.title || 'New Chat'}
          </h2>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg-light rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-dark-text" />
          ) : (
            <Moon size={20} className="text-gray-700" />
          )}
        </button>
      </div>
    </header>
  );
};
