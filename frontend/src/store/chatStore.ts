import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message } from '../types';

interface ChatStore {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
  streamingText: string;

  // Actions
  createConversation: () => string;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  deleteConversation: (conversationId: string) => void;
  clearAllConversations: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStreaming: (streaming: boolean) => void;
  setStreamingText: (text: string) => void;
  appendStreamingText: (text: string) => void;
  getCurrentConversation: () => Conversation | null;
  editMessage: (conversationId: string, messageId: string, newContent: string) => void;
  deleteMessagesFrom: (conversationId: string, messageId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      error: null,
      isStreaming: false,
      streamingText: '',

      createConversation: () => {
        const newConversation: Conversation = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id,
        }));

        return newConversation.id;
      },

      setCurrentConversation: (id: string) => {
        set({ currentConversationId: id });
      },

      addMessage: (conversationId: string, message: Message) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: Date.now(),
                }
              : conv
          ),
        }));
      },

      updateConversationTitle: (conversationId: string, title: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, title, updatedAt: Date.now() }
              : conv
          ),
        }));
      },

      deleteConversation: (conversationId: string) => {
        set((state) => {
          const newConversations = state.conversations.filter(
            (conv) => conv.id !== conversationId
          );
          const newCurrentId =
            state.currentConversationId === conversationId
              ? newConversations[0]?.id || null
              : state.currentConversationId;

          return {
            conversations: newConversations,
            currentConversationId: newCurrentId,
          };
        });
      },

      clearAllConversations: () => {
        set({
          conversations: [],
          currentConversationId: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setStreaming: (streaming: boolean) => {
        set({ isStreaming: streaming });
        if (!streaming) {
          set({ streamingText: '' });
        }
      },

      setStreamingText: (text: string) => {
        set({ streamingText: text });
      },

      appendStreamingText: (text: string) => {
        set((state) => ({ streamingText: state.streamingText + text }));
      },

      getCurrentConversation: () => {
        const state = get();
        return (
          state.conversations.find(
            (conv) => conv.id === state.currentConversationId
          ) || null
        );
      },

      editMessage: (conversationId: string, messageId: string, newContent: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, content: newContent } : msg
                  ),
                  updatedAt: Date.now(),
                }
              : conv
          ),
        }));
      },

      deleteMessagesFrom: (conversationId: string, messageId: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id === conversationId) {
              const messageIndex = conv.messages.findIndex((m) => m.id === messageId);
              if (messageIndex !== -1) {
                return {
                  ...conv,
                  messages: conv.messages.slice(0, messageIndex),
                  updatedAt: Date.now(),
                };
              }
            }
            return conv;
          }),
        }));
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);
