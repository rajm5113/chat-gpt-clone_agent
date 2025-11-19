import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Moon,
  Sun,
  X,
  Edit3,
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useThemeStore } from '../store/themeStore';

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
  } = useChatStore();

  const { theme, toggleTheme } = useThemeStore();

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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gpt-dark-sidebar flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header with New Chat */}
        <div className="p-2">
          <div className="flex items-center justify-between mb-1 px-2 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-md transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-md border border-white/20 hover:bg-white/10 transition-colors text-white"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {conversations.length === 0 ? (
            <div className="px-2 py-8 text-center text-sm text-white/50">
              No chats yet
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-colors ${
                    conv.id === currentConversationId
                      ? 'bg-white/10'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <MessageSquare size={16} className="flex-shrink-0 text-white/70" />
                  <div className="flex-1 min-w-0 text-sm text-white truncate">
                    {conv.title}
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded transition-all"
                    title="Delete chat"
                  >
                    <Trash2 size={14} className="text-white/70" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with theme toggle */}
        <div className="border-t border-white/20 p-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-white/10 transition-colors text-white"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-white/70" />
            ) : (
              <Moon size={18} className="text-white/70" />
            )}
            <span className="text-sm">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
