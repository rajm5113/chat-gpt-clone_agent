import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim() === '') {
      console.error('❌ CRITICAL: GeminiService initialized with empty API key!');
      throw new Error('GEMINI_API_KEY is required but not provided');
    }

    console.log(`🔑 Initializing GeminiService with API key: ${apiKey.substring(0, 10)}...`);

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    console.log('✅ GeminiService initialized successfully');
  }

  async generateResponse(message: string, conversationHistory: Message[] = []): Promise<string> {
    try {
      // Convert conversation history to Gemini format
      const chat = this.model.startChat({
        history: conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.9,
          topP: 1,
          topK: 1,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw new Error(error.message || 'Failed to generate response');
    }
  }

  async generateStreamingResponse(
    message: string,
    conversationHistory: Message[] = []
  ): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      const chat = this.model.startChat({
        history: conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.9,
          topP: 1,
          topK: 1,
        },
      });

      const result = await chat.sendMessageStream(message);

      async function* generateChunks() {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          yield chunkText;
        }
      }

      return generateChunks();
    } catch (error: any) {
      console.error('Gemini Streaming Error:', error);
      throw new Error(error.message || 'Failed to generate streaming response');
    }
  }

  async generateTitle(firstMessage: string): Promise<string> {
    try {
      const prompt = `Generate a very short title (max 5 words) for a conversation that starts with: "${firstMessage}". Only respond with the title, nothing else.`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim().replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error('Title generation error:', error);
      return firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    }
  }
}
