import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Settings,
  Moon,
  Sun,
  Download,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useThemeStore } from '../store/themeStore';
import { formatTimestamp, exportConversationAsText, exportConversationAsMarkdown } from '../utils/helpers';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    conversations,
    currentConversationId,
    createConversation,
    setCurrentConversation,
    deleteConversation,
    clearAllConversations,
    getCurrentConversation,
  } = useChatStore();

  const { theme, toggleTheme } = useThemeStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNewChat = () => {
    createConversation();
    onClose();
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    onClose();
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      deleteConversation(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all conversations? This cannot be undone.')) {
      clearAllConversations();
      setShowDeleteConfirm(false);
    }
  };

  const handleExportCurrent = (format: 'text' | 'markdown') => {
    const current = getCurrentConversation();
    if (!current) return;

    if (format === 'text') {
      exportConversationAsText(current.title, current.messages);
    } else {
      exportConversationAsMarkdown(current.title, current.messages);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">ChatGPT Clone</h1>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-800 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs text-gray-400 px-3 py-2 font-semibold">
            Recent Chats
          </div>
          {conversations.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-gray-500">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`group flex items-center gap-2 px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                    conv.id === currentConversationId
                      ? 'bg-gray-800'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <MessageSquare size={16} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{conv.title}</div>
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(conv.updatedAt)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-2">
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-2 p-3 bg-gray-800 rounded-lg space-y-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700 rounded transition-colors"
              >
                <span className="text-sm flex items-center gap-2">
                  {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                  Theme
                </span>
                <span className="text-xs text-gray-400 capitalize">{theme}</span>
              </button>

              {/* Export Options */}
              {currentConversationId && (
                <>
                  <button
                    onClick={() => handleExportCurrent('text')}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <span className="text-sm flex items-center gap-2">
                      <Download size={16} />
                      Export as Text
                    </span>
                  </button>
                  <button
                    onClick={() => handleExportCurrent('markdown')}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <span className="text-sm flex items-center gap-2">
                      <Download size={16} />
                      Export as Markdown
                    </span>
                  </button>
                </>
              )}

              {/* Clear All */}
              {conversations.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-red-800 bg-red-900 rounded transition-colors"
                >
                  <span className="text-sm flex items-center gap-2">
                    <Trash2 size={16} />
                    Clear All Chats
                  </span>
                </button>
              )}
            </div>
          )}

          {/* User Profile */}
          <div className="mt-2 flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">User</div>
              <div className="text-xs text-gray-500">Free Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Clear All Conversations?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete all your conversations. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete All
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
