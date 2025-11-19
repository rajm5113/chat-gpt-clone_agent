import React, { useState } from 'react';
import { Copy, Check, Edit2, RotateCw, User, Bot } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Message } from '../types';
import { copyToClipboard, formatMessageTime } from '../utils/helpers';

interface MessageBubbleProps {
  message: Message;
  onEdit?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  showActions?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onEdit,
  onRegenerate,
  showActions = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEditSave = () => {
    if (onEdit && editedContent.trim() !== message.content) {
      onEdit(message.id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`group relative px-4 py-6 ${
        isUser
          ? 'bg-white dark:bg-dark-bg'
          : 'bg-gray-50 dark:bg-dark-bg-light'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center ${
            isUser
              ? 'bg-blue-500'
              : 'bg-green-500'
          }`}
        >
          {isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-bg-lighter text-gray-900 dark:text-dark-text resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save & Submit
                </button>
                <button
                  onClick={handleEditCancel}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="prose dark:prose-invert max-w-none text-gray-900 dark:text-dark-text">
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-bg-lighter transition-colors"
                    title="Copy message"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className="text-gray-500 dark:text-gray-400" />
                    )}
                  </button>

                  {isUser && onEdit && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-bg-lighter transition-colors"
                      title="Edit message"
                    >
                      <Edit2 size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  )}

                  {!isUser && onRegenerate && (
                    <button
                      onClick={() => onRegenerate(message.id)}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-bg-lighter transition-colors"
                      title="Regenerate response"
                    >
                      <RotateCw size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  )}

                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
