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
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {!currentConversation || currentConversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <Bot size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-dark-text mb-2">
              How can I help you today?
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Start a conversation by typing a message below. I'm powered by Google Gemini and ready to assist you!
            </p>
          </div>
        ) : (
          <>
            {currentConversation.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onEdit={handleEditMessage}
                onRegenerate={handleRegenerateResponse}
              />
            ))}

            {isStreaming && streamingText && (
              <div className="bg-gray-50 dark:bg-dark-bg-light px-4 py-6">
                <div className="max-w-3xl mx-auto flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-green-500 flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0 prose dark:prose-invert max-w-none text-gray-900 dark:text-dark-text">
                    <p className="whitespace-pre-wrap">{streamingText}</p>
                  </div>
                </div>
              </div>
            )}

            {(isLoading || isStreaming) && !streamingText && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        onStop={handleStopGeneration}
        disabled={isLoading}
        isStreaming={isStreaming}
      />
    </div>
  );
};
