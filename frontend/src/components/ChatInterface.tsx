import React, { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '../store/chatStore';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { chatAPI } from '../services/api';
import { Message } from '../types';
import { Bot } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const {
    getCurrentConversation,
    currentConversationId,
    createConversation,
    addMessage,
    updateConversationTitle,
    isLoading,
    setLoading,
    setError,
    isStreaming,
    setStreaming,
    streamingText,
    setStreamingText,
    appendStreamingText,
    editMessage,
    deleteMessagesFrom,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConversation = getCurrentConversation();
  const hasMessages = currentConversation && currentConversation.messages.length > 0;

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, streamingText]);

  const handleSendMessage = async (content: string) => {
    try {
      setError(null);

      // Create conversation if none exists
      let convId = currentConversationId;
      if (!convId) {
        convId = createConversation();
      }

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      addMessage(convId, userMessage);

      // Get conversation for context
      const conversation = getCurrentConversation();
      const messages = conversation?.messages || [];

      // Generate title if this is the first message
      if (messages.length === 1) {
        chatAPI.generateTitle(content).then((title) => {
          updateConversationTitle(convId!, title);
        }).catch((err) => {
          console.error('Failed to generate title:', err);
        });
      }

      // Stream response from API
      setStreaming(true);
      setStreamingText('');

      await chatAPI.streamMessage(
        content,
        convId,
        messages,
        (chunk) => {
          if (chunk.error) {
            setError(chunk.error);
            setStreaming(false);
            return;
          }

          if (chunk.done) {
            if (chunk.message) {
              addMessage(convId!, chunk.message);
            }
            setStreaming(false);
            setStreamingText('');
          } else if (chunk.text) {
            appendStreamingText(chunk.text);
          }
        }
      );
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
      setStreaming(false);
      setStreamingText('');
    }
  };

  const handleStopGeneration = () => {
    setStreaming(false);
    setStreamingText('');
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!currentConversationId) return;

    // Delete all messages from this point forward
    deleteMessagesFrom(currentConversationId, messageId);

    // Edit the message
    editMessage(currentConversationId, messageId, newContent);

    // Resend with updated content
    await handleSendMessage(newContent);
  };

  const handleRegenerateResponse = async (messageId: string) => {
    if (!currentConversationId) return;

    const conversation = getCurrentConversation();
    if (!conversation) return;

    // Find the message before this one (should be user message)
    const messageIndex = conversation.messages.findIndex((m) => m.id === messageId);
    if (messageIndex <= 0) return;

    const userMessage = conversation.messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    // Delete from this AI message forward
    deleteMessagesFrom(currentConversationId, messageId);

    // Regenerate
    await handleSendMessage(userMessage.content);
  };

  return (
    <div className="flex flex-col h-full relative">
      {!hasMessages ? (
        /* EMPTY STATE - Centered */
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl font-semibold text-gpt-light-text dark:text-gpt-dark-text mb-10 text-center">
              What can I help you with?
            </h1>

            {/* Centered Input */}
            <div className="w-full">
              <ChatInput
                onSend={handleSendMessage}
                onStop={handleStopGeneration}
                disabled={isLoading}
                isStreaming={isStreaming}
                placeholder="Message ChatGPT..."
              />
            </div>
          </div>
        </div>
      ) : (
        /* CHAT STATE - Messages with bottom input */
        <>
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {currentConversation.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onEdit={handleEditMessage}
                onRegenerate={handleRegenerateResponse}
              />
            ))}

            {/* Streaming Message */}
            {isStreaming && streamingText && (
              <div className="w-full border-b border-black/10 dark:border-gray-900/50 bg-gpt-light-message dark:bg-gpt-dark-message">
                <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <Bot size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5 text-gpt-light-text dark:text-gpt-dark-text">
                    <p className="whitespace-pre-wrap leading-7">{streamingText}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {(isLoading || isStreaming) && !streamingText && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t border-gpt-light-border dark:border-gpt-dark-border bg-white dark:bg-gpt-dark-bg">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSend={handleSendMessage}
                onStop={handleStopGeneration}
                disabled={isLoading}
                isStreaming={isStreaming}
                placeholder="Message ChatGPT..."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
