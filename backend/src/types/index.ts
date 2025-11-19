export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  messages?: Message[];
}

export interface ChatResponse {
  message: Message;
  conversationId: string;
}

export interface StreamChunk {
  text: string;
  done: boolean;
}
