import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GeminiService } from '../services/gemini.service';
import { Message, ChatRequest, ChatResponse } from '../types';

export class ChatController {
  private geminiService: GeminiService;

  constructor(geminiService: GeminiService) {
    this.geminiService = geminiService;
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, conversationId, messages = [] }: ChatRequest = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Generate response from Gemini
      const responseText = await this.geminiService.generateResponse(message, messages);

      const responseMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };

      const response: ChatResponse = {
        message: responseMessage,
        conversationId: conversationId || uuidv4(),
      };

      res.json(response);
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({
        error: error.message || 'Failed to process message',
        details: error.toString()
      });
    }
  }

  async streamMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, conversationId, messages = [] }: ChatRequest = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Set headers for SSE (Server-Sent Events)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await this.geminiService.generateStreamingResponse(message, messages);

      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ text: chunk, done: false })}\n\n`);
      }

      // Send final message with complete response and metadata
      const responseMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: fullResponse,
        timestamp: Date.now(),
      };

      res.write(`data: ${JSON.stringify({
        text: '',
        done: true,
        message: responseMessage,
        conversationId: conversationId || uuidv4()
      })}\n\n`);

      res.end();
    } catch (error: any) {
      console.error('Streaming error:', error);
      res.write(`data: ${JSON.stringify({
        error: error.message || 'Failed to stream message',
        done: true
      })}\n\n`);
      res.end();
    }
  }

  async generateTitle(req: Request, res: Response): Promise<void> {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const title = await this.geminiService.generateTitle(message);
      res.json({ title });
    } catch (error: any) {
      console.error('Title generation error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate title'
      });
    }
  }
}
