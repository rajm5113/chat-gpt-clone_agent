import React, { useState } from 'react';
import { Copy, Check, Edit2, RotateCw, User, Bot } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Message } from '../types';
import { copyToClipboard } from '../utils/helpers';

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
      className={`group w-full border-b border-black/10 dark:border-gray-900/50 ${
        isUser
          ? 'bg-white dark:bg-gpt-dark-bg'
          : 'bg-gpt-light-message dark:bg-gpt-dark-message'
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 flex gap-6">
        {/* Small circular avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser
                ? 'bg-blue-500'
                : 'bg-green-600'
            }`}
          >
            {isUser ? (
              <User size={18} className="text-white" />
            ) : (
              <Bot size={18} className="text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gpt-dark-border rounded-md bg-white dark:bg-gpt-dark-bg text-gpt-light-text dark:text-gpt-dark-text resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditSave}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Save & Submit
                </button>
                <button
                  onClick={handleEditCancel}
                  className="px-3 py-1.5 bg-transparent hover:bg-gray-100 dark:hover:bg-gpt-dark-border border border-gray-300 dark:border-gpt-dark-border text-gpt-light-text dark:text-gpt-dark-text rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-gpt-light-text dark:text-gpt-dark-text">
                {isUser ? (
                  <p className="whitespace-pre-wrap leading-7">{message.content}</p>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Copy message"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className="text-gpt-light-text-secondary dark:text-gpt-dark-text-secondary" />
                    )}
                  </button>

                  {isUser && onEdit && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Edit message"
                    >
                      <Edit2 size={16} className="text-gpt-light-text-secondary dark:text-gpt-dark-text-secondary" />
                    </button>
                  )}

                  {!isUser && onRegenerate && (
                    <button
                      onClick={() => onRegenerate(message.id)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Regenerate response"
                    >
                      <RotateCw size={16} className="text-gpt-light-text-secondary dark:text-gpt-dark-text-secondary" />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
